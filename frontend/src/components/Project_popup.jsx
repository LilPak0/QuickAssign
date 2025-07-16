import { useState } from 'react';
import { FiX } from 'react-icons/fi';

export function ProjectPopup({ isOpen, onClose, onSubmit }) {
  const [project, setProject] = useState({
    name: '',
    description: '',
    requirements: { backend: 1, frontend: 1, design: 1 }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (role, value) => {
    setProject(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [role]: parseInt(value) || 0
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(project);
        }}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Project</h2>
              <button 
                type="button" 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={project.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={project.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  rows="3"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Team Requirements</h3>
                <div className="space-y-2">
                  {Object.entries(project.requirements).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <span className="capitalize text-sm text-gray-600">{role}</span>
                      <input
                        type="number"
                        min="0"
                        value={count}
                        onChange={(e) => handleRequirementChange(role, e.target.value)}
                        className="w-16 p-1 border rounded text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-4"
              >
                Create Project
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}