import { useState, useEffect } from 'react';
import { FiFilter, FiPlus } from 'react-icons/fi';
import { ProjectPopup } from '../components/Project_popup';
import { ProjectCard } from '../components/Project_Card';
import { MemberPopup } from '../components/Member_Popup';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';

// Draggable Member Component
function DraggableMember({ member, onMemberClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: member?.id?.toString() || 'unknown',
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleClick = (e) => {
    // Only trigger click if not currently dragging
    if (!isDragging && member) {
      onMemberClick(member);
    }
  };

  // Safety check for member data
  if (!member || !member.name) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`p-3 mb-2 rounded-lg cursor-pointer hover:shadow-md transition-transform ${
        member.role === 'Backend Developer' ? 'bg-orange-100 border-orange-200' :
        member.role === 'Frontend Developer' ? 'bg-blue-100 border-blue-200' :
        member.role === 'Designer UX/UI' ? 'bg-purple-100 border-purple-200' :
        'bg-gray-100 border-gray-200'
      } border ${isDragging ? 'opacity-0' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          member.role === 'Backend Developer' ? 'bg-orange-200 text-orange-800' :
          member.role === 'Frontend Developer' ? 'bg-blue-200 text-blue-800' :
          member.role === 'Designer UX/UI' ? 'bg-purple-200 text-purple-800' :
          'bg-gray-200 text-gray-800'
        } font-medium`}>
          {member.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{member.name}</p>
          <div className="flex gap-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded-full capitalize ${
              member.role === 'Backend Developer' ? 'bg-orange-200 text-orange-800' :
              member.role === 'Frontend Developer' ? 'bg-blue-200 text-blue-800' :
              member.role === 'Designer UX/UI' ? 'bg-purple-200 text-purple-800' :
              'bg-gray-200 text-gray-800'
            }`}>
              {member.role}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              member.experience === 'Senior' ? 'bg-green-100 text-green-700' :
              member.experience === 'Mid-Level' ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {member.experience}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Drag Preview Component
function DragPreview({ member }) {
  return (
    <div className={`p-3 rounded-lg shadow-lg border-2 ${
      member.role === 'Backend Developer' ? 'bg-orange-100 border-orange-300' :
      member.role === 'Frontend Developer' ? 'bg-blue-100 border-blue-300' :
      member.role === 'Designer UX/UI' ? 'bg-purple-100 border-purple-300' :
      'bg-gray-100 border-gray-300'
    } opacity-90 pointer-events-none`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          member.role === 'Backend Developer' ? 'bg-orange-200 text-orange-800' :
          member.role === 'Frontend Developer' ? 'bg-blue-200 text-blue-800' :
          member.role === 'Designer UX/UI' ? 'bg-purple-200 text-purple-800' :
          'bg-gray-200 text-gray-800'
        } font-medium`}>
          {member.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-sm">{member.name}</p>
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${
            member.role === 'Backend Developer' ? 'bg-orange-200 text-orange-800' :
            member.role === 'Frontend Developer' ? 'bg-blue-200 text-blue-800' :
            member.role === 'Designer UX/UI' ? 'bg-purple-200 text-purple-800' :
            'bg-gray-200 text-gray-800'
          }`}>
            {member.role}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DashBoard() {
  const [showFilters, setShowFilters] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [draggedMember, setDraggedMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3033/api/employees/allemployees');
        
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        
        const employees = await response.json();
        
        // Transform backend data to match frontend format
        const transformedEmployees = employees.map(emp => ({
          id: emp._id, // MongoDB uses _id
          name: `${emp.firstName} ${emp.lastName}`, // Combine first and last name
          role: emp.specialty, // Backend uses 'specialty', frontend expects 'role'
          experience: emp.experience,
          skills: emp.skills,
          email: emp.email,
          phone: emp.phone || "Not provided" // Default if phone is missing
        }));
        
        setTeamMembers(transformedEmployees);
        setError(null);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err.message);
        // Fallback to empty array on error
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Role colors
  const roleColors = {
    "Backend Developer": { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
    "Frontend Developer": { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    "Designer UX/UI": { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    "DevOps Engineer": { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
    "Data Analyst": { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    "Business Analyst": { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    "QA Engineer/Tester": { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleSubmitProject = (projectData) => {
    setProjects([...projects, {
      ...projectData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      assignedMembers: {} // Track assigned members by role
    }]);
    setIsPopupOpen(false);
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const handleCloseMemberPopup = () => {
    setSelectedMember(null);
  };

  function handleDragStart(event) {
    const { active } = event;
    const member = teamMembers.find(m => m.id.toString() === active.id);
    setDraggedMember(member);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setDraggedMember(null);

    if (!over) return;

    const memberId = parseInt(active.id);
    const [projectId, role] = over.id.split('-');
    
    if (projectId && role) {
      handleDropMember(parseInt(projectId), memberId, role);
    }
  }

  const handleDropMember = (projectId, memberId, role) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const currentAssigned = project.assignedMembers?.[role] || [];
        const requiredCount = project.requirements[role];
        
        // Only allow adding if not already assigned AND if under the requirement limit
        if (!currentAssigned.includes(memberId) && currentAssigned.length < requiredCount) {
          return {
            ...project,
            assignedMembers: {
              ...project.assignedMembers,
              [role]: [...currentAssigned, memberId]
            }
          };
        }
      }
      return project;
    }));
  };

  const handleRemoveMember = (projectId, memberId, role) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const currentAssigned = project.assignedMembers?.[role] || [];
        return {
          ...project,
          assignedMembers: {
            ...project.assignedMembers,
            [role]: currentAssigned.filter(id => id !== memberId)
          }
        };
      }
      return project;
    }));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen bg-gray-50">
        {/* Left Sidebar - Team Members */}
        <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-500 hover:text-blue-600"
            >
              <FiFilter size={20} />
            </button>
          </div>

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="p-4 border-b border-gray-200 space-y-3">
              <div>
                <h3 className="text-sm font-medium mb-1">Experience</h3>
                <select className="w-full p-2 border rounded text-sm">
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Mid-Level</option>
                  <option>Senior</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Role</h3>
                <div className="space-y-1">
                  {Object.keys(roleColors).map(role => (
                    <label key={role} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500">Loading team members...</div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-red-500">Error: {error}</div>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500">No team members found</div>
              </div>
            ) : (
              teamMembers.map(member => (
                <DraggableMember 
                  key={member.id} 
                  member={member} 
                  onMemberClick={handleMemberClick}
                />
              ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Projects</h1>
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDropMember={handleDropMember}
                  onRemoveMember={handleRemoveMember}
                  teamMembers={teamMembers}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiPlus className="text-gray-400" size={40} />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-6">Create your first project to get started</p>
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Project
              </button>
            </div>
          )}        {/* Floating Action Button */}
        <button
          onClick={() => setIsPopupOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-white transition-transform hover:scale-105"
        >
          <FiPlus size={24} />
        </button>
      </div>

      <ProjectPopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleSubmitProject}
      />

      {/* Member Popup Component */}
      <MemberPopup 
        member={selectedMember}
        onClose={handleCloseMemberPopup}
        roleColors={roleColors}
      />

      <DragOverlay>
        {draggedMember ? <DragPreview member={draggedMember} /> : null}
      </DragOverlay>
    </div>
    </DndContext>
  );
}