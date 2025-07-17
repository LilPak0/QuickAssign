import React, { useEffect, useState } from 'react';
import NavBar from '../components/Navbar';
import { ProjectCard } from '../components/Project_Card';

export default function Ongoing() {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOngoingProjects = async () => {
      try {
        const response = await fetch('http://localhost:3033/api/projects/filters?status=Ongoing');
        if (!response.ok) throw new Error('Failed to fetch ongoing projects');
        const projectsData = await response.json();
        const frontendProjects = projectsData.map((proj) => {
          const frontendProject = {
            id: proj._id,
            name: proj.title,
            client: proj.client,
            description: proj.description,
            requirements: {},
            assignedMembers: {},
            createdAt: proj.deadline || new Date().toISOString(),
            ...proj
          };
          if (Array.isArray(proj.projectNeeds)) {
            proj.projectNeeds.forEach((need) => {
              frontendProject.requirements[need.specialty] = need.slots;
              // Build assignedMembers for each role
              frontendProject.assignedMembers[need.specialty] = need.assigned ? need.assigned.filter(id => id !== null) : [];
            });
          }
          return frontendProject;
        });
        setProjects(frontendProjects);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('http://localhost:3033/api/employees/allemployees');
        if (!response.ok) throw new Error('Failed to fetch employees');
        const employees = await response.json();
        const transformedEmployees = employees.map(emp => ({
          id: emp._id,
          name: `${emp.firstName} ${emp.lastName}`,
          role: emp.specialty,
          experience: emp.experience,
          skills: emp.skills,
          email: emp.email,
          phone: emp.phone || "Not provided"
        }));
        setTeamMembers(transformedEmployees);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingProjects();
    fetchTeamMembers();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3033/api/projects/filters?status=Ongoing');
      if (!response.ok) throw new Error('Failed to fetch ongoing projects');
      const projectsData = await response.json();
      const frontendProjects = projectsData.map((proj) => {
        const frontendProject = {
          id: proj._id,
          name: proj.title,
          client: proj.client,
          description: proj.description,
          requirements: {},
          assignedMembers: {},
          createdAt: proj.deadline || new Date().toISOString(),
          ...proj
        };
        if (Array.isArray(proj.projectNeeds)) {
          proj.projectNeeds.forEach((need) => {
            frontendProject.requirements[need.specialty] = need.slots;
            // Build assignedMembers for each role
            frontendProject.assignedMembers[need.specialty] = need.assigned ? need.assigned.filter(id => id !== null) : [];
          });
        }
        return frontendProject;
      });
      setProjects(frontendProjects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await fetch(`http://localhost:3033/api/projects/delete/${projectId}`, {
          method: 'DELETE',
        });
        await fetchProjects();
      } catch (err) {
        alert('Failed to delete project.');
      }
    }
  };

  const handleFinishProject = async (projectId) => {
    if (window.confirm('Mark this project as finished?')) {
      try {
        const response = await fetch(`http://localhost:3033/api/projects/${projectId}/finish`, {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to finish project');
        await fetchProjects();
        alert('Project marked as finished!');
      } catch (err) {
        alert('Failed to finish project.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      <NavBar />
      <div className="flex-1 p-6 overflow-y-auto w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ongoing Projects</h1>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading ongoing projects...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-red-500">Error: {error}</div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                teamMembers={teamMembers}
                onDeleteProject={handleDeleteProject}
                onCompleteProject={handleFinishProject}
                allowMemberRemoval={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-400 text-4xl">+</span>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No ongoing projects</h3>
            <p className="text-gray-500 mb-6">Start a project to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}
