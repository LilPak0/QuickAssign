import { useState } from 'react';
import { FiMoreHorizontal, FiUsers } from 'react-icons/fi';

export function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-800">{project.name}</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <FiMoreHorizontal />
          </button>
        </div>
        <p className="text-gray-600 mt-2 text-sm line-clamp-2">{project.description}</p>
        
        <div className="mt-4">
          <div className="flex items-center text-sm text-gray-500">
            <FiUsers className="mr-1" />
            <span>Team Requirements:</span>
          </div>
          <div className="flex gap-2 mt-2">
            {Object.entries(project.requirements).map(([role, count]) => (
              count > 0 && (
                <span 
                  key={role} 
                  className={`text-xs px-2 py-1 rounded-full ${
                    role === 'backend' ? 'bg-orange-100 text-orange-800' :
                    role === 'frontend' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}
                >
                  {count} {role}
                </span>
              )
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Created: {new Date().toLocaleDateString()}</span>
          <span>0 tasks</span>
        </div>
      </div>
    </div>
  );
}