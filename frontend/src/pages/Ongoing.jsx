import React, { useEffect, useState } from 'react';
import NavBar from '../components/Navbar';
import { ProjectCard } from '../components/Project_Card';


export default function Ongoing({ teamMembers = [] }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("http://localhost:3033/api/projects/filters?status=Ongoing");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      <NavBar />
      <div className="flex-1 p-6 overflow-y-auto w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ongoing Projects</h1>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                teamMembers={teamMembers}
                // No drag/drop or remove actions
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
