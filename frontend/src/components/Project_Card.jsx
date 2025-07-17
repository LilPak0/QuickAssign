import { FiMoreHorizontal, FiUsers, FiTrash2, FiCalendar, FiCheckSquare, FiCheck, FiX } from 'react-icons/fi';
import { useDroppable } from '@dnd-kit/core';


// Droppable Zone Component
function DroppableZone({ id, children, role, roleLabel, project, teamMembers, className, color }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const getAssignedMembers = (role) => {
    return teamMembers.filter(member => 
      project.assignedMembers?.[role]?.includes(member.id)
    );
  };

  const assignedMembers = getAssignedMembers(role);
  const requiredCount = project.requirements[roleLabel]; // use short key for requirements
  const assignedCount = assignedMembers.length;
  const isFull = assignedCount >= requiredCount;

  let dragOverClass = '';
  if (isOver && !isFull) {
    if (role === 'Backend Developer' || role === 'DevOps Engineer') dragOverClass = 'bg-orange-50 border-orange-400';
    else if (role === 'Frontend Developer' || role === 'Data Analyst') dragOverClass = 'bg-blue-50 border-blue-400';
    else if (role === 'Designer UX/UI' || role === 'Business Analyst') dragOverClass = 'bg-purple-50 border-purple-400';
    else if (role === 'QA Engineer/Tester') dragOverClass = 'bg-green-50 border-green-400';
  }

  return (
    <div
      ref={setNodeRef}
      className={`p-2 rounded-lg border-2 border-dashed min-h-16 transition-all duration-200 
        ${color.bg} ${color.border} 
        ${isOver && !isFull ? `border-solid ${dragOverClass}` : ''}
        ${isOver && isFull ? 'border-solid bg-red-100 border-red-300' : ''}
        ${className || ''}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className={`font-medium capitalize ${color.text}`}>{roleLabel} ({requiredCount})</span>
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

export function ProjectCard({ project, onDropMember, teamMembers, onRemoveMember, onCompleteProject, onDeleteProject }) {
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

  // Map short keys to full backend role names
  const roleKeyToFullRole = {
    Backend: 'Backend Developer',
    Frontend: 'Frontend Developer',
    Design: 'Designer UX/UI',
    DevOps: 'DevOps Engineer',
    Data: 'Data Analyst',
    Business: 'Business Analyst',
    QA: 'QA Engineer/Tester',
  };

  const roleColors = {
    "Backend Developer": { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' },
    "Frontend Developer": { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' },
    "Designer UX/UI": { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800' },
    "DevOps Engineer": { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' },
    "Data Analyst": { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' },
    "Business Analyst": { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800' },
    "QA Engineer/Tester": { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow max-w-sm">
      <div className="p-3">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-base text-gray-800">{project.name}</h3>
          <div className="flex gap-1">
            <button 
              onClick={() => onCompleteProject(project.id)}
              className="w-6 h-6 rounded-full bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700 flex items-center justify-center transition-colors"
              title="Mark as complete"
            >
              <FiCheck size={12} />
            </button>
            <button 
              onClick={() => onDeleteProject(project.id)}
              className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 flex items-center justify-center transition-colors"
              title="Delete project"
            >
              <FiX size={12} />
            </button>
          </div>
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
        {
          Object.entries(project.requirements).map(([role, count]) => {
            const fullRole = roleKeyToFullRole[role] || role;
            const color = roleColors[fullRole] || { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-800' };
            return count > 0 && (
              <DroppableZone
                key={role}
                id={`${project.id}-${role}`}
                role={fullRole}
                roleLabel={role}
                project={project}
                teamMembers={teamMembers}
                color={color}
              >
                {/* Assigned Members */}
                <div className="space-y-1">
                  {getAssignedMembers(fullRole).map(member => (
                    <div 
                      key={member.id}
                      className={`p-2 rounded-lg border-2 ${
                        fullRole === 'Backend Developer' || fullRole === 'DevOps Engineer' ? 'bg-orange-50 border-orange-100' :
                        fullRole === 'Frontend Developer' || fullRole === 'Data Analyst' ? 'bg-blue-50 border-blue-100' :
                        fullRole === 'Designer UX/UI' || fullRole === 'Business Analyst' ? 'bg-purple-50 border-purple-100' :
                        fullRole === 'QA Engineer/Tester' ? 'bg-green-50 border-green-100' :
                        'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${color.bg} ${color.text} font-medium text-xs`}>
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
                          onClick={() => onRemoveMember(project.id, member.id, fullRole)}
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
            );
          })
        }
      </div>
    </div>
  );
}

