import { FiMoreHorizontal, FiUsers, FiTrash2, FiCalendar, FiCheckSquare, FiPlay, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useDroppable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';

// Status Badge Component
function StatusBadge({ status }) {
  const statusConfig = {
    planning: { color: 'bg-blue-100 text-blue-800', icon: <FiCalendar className="mr-1" /> },
    ongoing: { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock className="mr-1" /> },
    completed: { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle className="mr-1" /> }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]?.color || 'bg-gray-100 text-gray-800'}`}>
      {statusConfig[status]?.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Droppable Zone Component (updated with status awareness)
function DroppableZone({ id, children, role, project, teamMembers, className }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const getAssignedMembers = (role) => {
    return teamMembers.filter(member => 
      project.assignedMembers?.[role]?.includes(member.id)
    );
  };

  const assignedMembers = getAssignedMembers(role);
  const requiredCount = project.requirements[role];
  const assignedCount = assignedMembers.length;
  const isFull = assignedCount >= requiredCount;

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${
        isOver && !isFull ? 'border-solid bg-opacity-30' : 
        isOver && isFull ? 'border-solid bg-red-100 border-red-300' : ''
      } ${isFull ? 'opacity-75' : ''}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium capitalize">{role} ({requiredCount})</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          assignedCount === requiredCount ? 'bg-green-100 text-green-700' :
          assignedCount > 0 ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-600'
        }`}>
          {assignedCount}/{requiredCount}
          {isFull ? ' (Full)' : ''}
        </span>
      </div>
      {children}
    </div>
  );
}

export function Ongoing({ project, onDropMember, teamMembers, onRemoveMember }) {
  const navigate = useNavigate();

  // Helper functions
  const getAssignedMembers = (role) => teamMembers.filter(member => 
    project.assignedMembers?.[role]?.includes(member.id)
  );

  const getTotalAssignedMembers = () => Object.values(project.assignedMembers || {}).flat().length;

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleBeginProject = () => {
    navigate('/ongoing', { 
      state: { 
        project: { ...project, status: 'ongoing' },
        teamMembers: getAssignedMembers('design')
      }
    });
  };

  const roleColors = {
    backend: 'bg-orange-100 text-orange-800 border-orange-200',
    frontend: 'bg-blue-100 text-blue-800 border-blue-200',
    design: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 max-w-sm group">
      {/* Status ribbon */}
      <div className="absolute top-2 right-2">
        <StatusBadge status={project.status || 'planning'} />
      </div>

      <div className="p-4">
        {/* Project Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{project.name}</h3>
            {project.client && (
              <p className="text-sm text-gray-500">Client: {project.client}</p>
            )}
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiMoreHorizontal size={18} />
          </button>
        </div>
        
        {/* Project Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{project.description}</p>
        
        {/* Project Metadata */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FiUsers className="text-gray-400" />
            <span>{getTotalAssignedMembers()} members</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-400" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheckSquare className="text-gray-400" />
            <span>0 tasks</span>
          </div>
        </div>
        
        {/* Role Sections */}
        {Object.entries(project.requirements).map(([role, count]) => count > 0 && (
          <DroppableZone
            key={role}
            id={`${project.id}-${role}`}
            role={role}
            project={project}
            teamMembers={teamMembers}
            className={`mb-3 p-3 rounded-lg border-2 border-dashed ${roleColors[role]} transition-all duration-200`}
          >
            {/* Assigned Members */}
            <div className="space-y-2">
              {getAssignedMembers(role).map(member => (
                <div 
                  key={member.id}
                  className={`p-2 rounded-lg border flex items-center gap-3 ${
                    role === 'backend' ? 'bg-orange-50 border-orange-200' :
                    role === 'frontend' ? 'bg-blue-50 border-blue-200' :
                    'bg-purple-50 border-purple-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    role === 'backend' ? 'bg-orange-200 text-orange-800' :
                    role === 'frontend' ? 'bg-blue-200 text-blue-800' :
                    'bg-purple-200 text-purple-800'
                  } font-medium text-sm`}>
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{member.name}</p>
                    <div className="flex gap-1 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        member.experience === 'Senior' ? 'bg-green-100 text-green-700' :
                        member.experience === 'Mid-Level' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {member.experience}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveMember(project.id, member.id, role)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remove member"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Button */}
            {role === 'design' && getAssignedMembers(role).length > 0 && (
              <button 
                className={`w-full mt-3 py-2 px-4 ${
                  project.status === 'ongoing' ? 
                  'bg-yellow-500 hover:bg-yellow-600' : 
                  'bg-green-500 hover:bg-green-600'
                } text-white rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors`}
                onClick={handleBeginProject}
              >
                <FiPlay size={14} />
                {project.status === 'ongoing' ? 'In Progress' : 'Begin Project'}
              </button>
            )}
          </DroppableZone>
        ))}
      </div>
    </div>
  );
}