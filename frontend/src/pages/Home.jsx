  import React from "react";

function Home() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Welcome to SkillShare</h1>
        <p className="text-gray-600 mb-8">A platform to share, learn and host skills and events collaboratively.</p>
        <div className="space-x-4">
          <a href="/skills" className="bg-indigo-600 text-white px-5 py-3 rounded hover:bg-indigo-700">Explore Skills</a>
          <a href="/events" className="bg-gray-200 text-gray-800 px-5 py-3 rounded hover:bg-gray-300">See Events</a>
        </div>
      </div>
    </div>
  );
}

export default Home;
