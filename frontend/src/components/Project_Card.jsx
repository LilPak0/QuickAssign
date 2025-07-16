import { FiMoreHorizontal, FiUsers, FiTrash2, FiCalendar, FiCheckSquare } from 'react-icons/fi';
import { useDroppable } from '@dnd-kit/core';


// Droppable Zone Component
function DroppableZone({ id, children, role, project, teamMembers, className }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

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

export function ProjectCard({ project, onDropMember, teamMembers, onRemoveMember }) {
  // Get members assigned to this project by role
  const getAssignedMembers = (role) => {
    return teamMembers.filter(member => 
      project.assignedMembers?.[role]?.includes(member.id)
    );
  };

  // Calculate total assigned members
  const getTotalAssignedMembers = () => {
    return Object.values(project.assignedMembers || {}).flat().length;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const roleColors = {
    backend: 'bg-orange-100 text-orange-800 border-orange-200',
    frontend: 'bg-blue-100 text-blue-800 border-blue-200',
    design: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow max-w-sm">
      <div className="p-3">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-base text-gray-800">{project.name}</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <FiMoreHorizontal size={16} />
          </button>
        </div>
        
        {project.client && (
          <p className="text-gray-500 text-xs mb-2">Client: {project.client}</p>
        )}
        
        <p className="text-gray-600 text-xs line-clamp-2 mb-3">{project.description}</p>
        
        {/* Project Info */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <FiUsers size={12} />
            <span>{getTotalAssignedMembers()} members</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar size={12} />
            <span>{formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCheckSquare size={12} />
            <span>0 tasks</span>
          </div>
        </div>
        
        {/* Role Sections with Drop Zones */}
        {Object.entries(project.requirements).map(([role, count]) => (
          count > 0 && (
            <DroppableZone
              key={role}
              id={`${project.id}-${role}`}
              role={role}
              project={project}
              teamMembers={teamMembers}
              className={`mt-3 p-2 rounded-lg border-2 border-dashed ${roleColors[role]} min-h-16 transition-all duration-200`}
            >
              {/* Assigned Members */}
              <div className="space-y-1">
                {getAssignedMembers(role).map(member => (
                  <div 
                    key={member.id}
                    className={`p-2 rounded-lg border ${
                      role === 'backend' ? 'bg-orange-50 border-orange-200' :
                      role === 'frontend' ? 'bg-blue-50 border-blue-200' :
                      'bg-purple-50 border-purple-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        role === 'backend' ? 'bg-orange-200 text-orange-800' :
                        role === 'frontend' ? 'bg-blue-200 text-blue-800' :
                        'bg-purple-200 text-purple-800'
                      } font-medium text-xs`}>
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-xs">{member.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            member.experience === 'Senior' ? 'bg-green-100 text-green-700' :
                            member.experience === 'Mid-Level' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {member.experience}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {member.skills.slice(0, 2).map(skill => (
                            <span 
                              key={skill} 
                              className="text-xs px-1 py-0.5 bg-gray-100 text-gray-600 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {member.skills.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{member.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveMember(project.id, member.id, role)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove member"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </DroppableZone>
          )
        ))}
      </div>
    </div>
  );
}

