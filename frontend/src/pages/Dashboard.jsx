import { useState } from 'react';
import { FiFilter, FiPlus } from 'react-icons/fi';
import { ProjectPopup } from '../components/Project_popup';

export default function DashBoard() {
  const [showFilters, setShowFilters] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  
  // Mock team data
  const teamMembers = [
    { id: 1, name: "Alex Chen", role: "backend", experience: "Senior", skills: ["Node.js", "Python"] },
    { id: 2, name: "Sarah Park", role: "frontend", experience: "Mid-Level", skills: ["React", "TypeScript"] },
    { id: 3, name: "Jamie Smith", role: "design", experience: "Junior", skills: ["Figma", "UI/UX"] }
  ];

  // Role colors
  const roleColors = {
    backend: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
    frontend: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    design: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' }
  };

  const handleSubmitProject = (projectData) => {
    console.log('New project created:', projectData);
    // Here you would typically send the data to your backend
    setIsPopupOpen(false); // Close the popup after submission
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col">
        {/* Header with filter button */}
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
                    <span className="text-sm capitalize">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Member List */}
        <div className="flex-1 overflow-y-auto p-2">
          {teamMembers.map(member => (
            <div 
              key={member.id}
              className={`p-3 mb-2 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                roleColors[member.role].bg
              } ${roleColors[member.role].border} border`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  roleColors[member.role].text
                } font-medium`}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      roleColors[member.role].bg
                    } ${roleColors[member.role].text}`}>
                      {member.role}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {member.experience}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty Right Side with (+) Button */}
      <div className="flex-1 relative">
        {/* Add Project Button */}
        <button
          onClick={() => setIsPopupOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-white transition-transform hover:scale-105"
        >
          <FiPlus size={24} />
        </button>
      </div>
      {/* Project Popup Component */}
      <ProjectPopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleSubmitProject}
      />
    </div>
  );
}
