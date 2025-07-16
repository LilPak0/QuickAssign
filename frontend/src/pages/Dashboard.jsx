import { useState } from 'react';
import { FiFilter, FiPlus, FiHome, FiClock, FiCheckCircle } from 'react-icons/fi';
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
import { Link, useLocation } from 'react-router-dom';

// NavBar Component
const NavBar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo on the left */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">
                TF
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800">
                TeamFlow
              </span>
            </Link>
          </div>

          {/* Navigation links on the right */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                location.pathname === '/'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <FiHome className="mr-1" />
              Dashboard
            </Link>
            <Link
              to="/ongoing"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                location.pathname === '/ongoing'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <FiClock className="mr-1" />
              Ongoing
            </Link>
            <Link
              to="/finished"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                location.pathname === '/finished'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <FiCheckCircle className="mr-1" />
              Finished
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Draggable Member Component
function DraggableMember({ member, onMemberClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: member.id.toString(),
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleClick = (e) => {
    if (!isDragging) {
      onMemberClick(member);
    }
  };

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

  

  const [teamMembers] = useState([
    { 
      id: 1, 
      name: "Alex Chen", 
      role: "Backend Developer", 
      experience: "Senior", 
      skills: ["Node.js", "Python"],
      email: "alex.chen@example.com",
      phone: "+1 (555) 123-4567"
    },
    { 
      id: 2, 
      name: "Sarah Park", 
      role: "Frontend Developer", 
      experience: "Mid-Level", 
      skills: ["React", "TypeScript"],
      email: "sarah.park@example.com",
      phone: "+1 (555) 987-6543"
    },
    { 
      id: 3, 
      name: "Jamie Smith", 
      role: "Designer UX/UI", 
      experience: "Junior", 
      skills: ["Figma", "UI/UX"],
      email: "jamie.smith@example.com",
      phone: "+1 (555) 456-7890"
    }
  ]);

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
      assignedMembers: {}
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
    <div className="flex flex-col h-screen bg-gray-50">
      <NavBar />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Team Members */}
          <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-500 hover:text-blue-600"
              >
                <FiFilter size={20} />
              </button>
            </div>

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
                        <span className="text-sm capitalize">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-2">
              {teamMembers.map(member => (
                <DraggableMember 
                  key={member.id} 
                  member={member} 
                  onMemberClick={handleMemberClick}
                />
              ))}
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
            )}
          </div>
        </div>

        <button
          onClick={() => setIsPopupOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-white transition-transform hover:scale-105"
        >
          <FiPlus size={24} />
        </button>

        <ProjectPopup 
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handleSubmitProject}
        />

        <MemberPopup 
          member={selectedMember}
          onClose={handleCloseMemberPopup}
          roleColors={roleColors}
        />

        <DragOverlay>
          {draggedMember ? <DragPreview member={draggedMember} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}