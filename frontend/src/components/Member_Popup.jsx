import { FiX } from 'react-icons/fi';

export const MemberPopup = ({ member, onClose, roleColors }) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={20} />
        </button>
        
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            roleColors[member.role].bg
          } ${roleColors[member.role].text} font-medium text-2xl`}>
            {member.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{member.name}</h2>
            <div className="flex gap-2 mt-1">
              <span className={`text-sm px-2 py-1 rounded-full ${
                roleColors[member.role].bg
              } ${roleColors[member.role].text}`}>
                {member.role}
              </span>
              <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                {member.experience}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Contact</h3>
          <p className="text-gray-600">{member.email}</p>
          <p className="text-gray-600">{member.phone}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
