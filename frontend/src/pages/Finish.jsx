import React from 'react';
import NavBar from '../components/Navbar';
import { ProjectCard } from '../components/Project_Card';

export default function Finish({ projects = [], teamMembers = [] }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      <NavBar />
      <div className="flex-1 p-6 overflow-y-auto w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Finished Projects</h1>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                teamMembers={teamMembers}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-400 text-4xl">+</span>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No finished projects</h3>
            <p className="text-gray-500 mb-6">Complete a project to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}
