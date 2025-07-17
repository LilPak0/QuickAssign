import { useState } from 'react';
import { FiX } from 'react-icons/fi';


export function ProjectPopup({ isOpen, onClose, onSubmit }) {
  const [project, setProject] = useState({
    name: '',
    client: '',
    description: '',
    requirements: { 'Backend Developer': 1, "Frontend Developer": 1, "Designer UX/UI": 1, "DevOps Engineer": 1, "Data Analyst": 1, "Business Analyst": 1, "QA Engineer/Tester": 1 },
    deadline: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Transform requirements to projectNeeds array
    const projectNeeds = Object.entries(project.requirements)
      .filter(([role, count]) => count > 0)
      .map(([role, count]) => ({
        specialty: role,
        slots: count,
        assigned: Array(count).fill(null)
      }));
    const payload = {
      title: project.name,
      client: project.client,
      description: project.description,
      projectNeeds,
      deadline: project.deadline || new Date().toISOString().slice(0,10)
    };
    try {
      const response = await fetch('http://localhost:3033/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to create project');
      setProject({
        name: '',
        client: '',
        description: '',
        requirements: { 'Backend Developer': 1, "Frontend Developer": 1, "Designer UX/UI": 1, "DevOps Engineer": 1, "Data Analyst": 1, "Business Analyst": 1, "QA Engineer/Tester": 1 },
        deadline: ''
      });
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Create New Project</h2>
              <button 
                type="button" 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-3">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <input
                  type="text"
                  name="client"
                  value={project.client}
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
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={project.deadline}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Team Requirements</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(project.requirements).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                      <span className="capitalize text-xs text-gray-600 whitespace-nowrap">{role}</span>
                      <input
                        type="number"
                        min="0"
                        value={count}
                        onChange={(e) => handleRequirementChange(role, e.target.value)}
                        className="w-12 p-1 border rounded text-center text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-3"
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