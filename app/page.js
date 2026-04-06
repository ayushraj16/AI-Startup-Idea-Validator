'use client'; // This tells Next.js this is a frontend component

import { useState } from 'react';

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);

    try {
      // Send the data to our backend API
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setReport(data.data); // The AI JSON report
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">AI Startup Idea Validator</h1>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Startup Title</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g., Uber for Dog Walking"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              required
              className="w-full p-2 border border-gray-300 rounded h-32"
              placeholder="Describe your idea in a few sentences..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Analyzing Idea...' : 'Validate Idea'}
          </button>
        </form>

        {/* AI Report Display Area */}
        {report && (
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Validation Report</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-100 p-4 rounded">
                <span className="font-bold text-gray-700">Risk Level: </span>
                <span>{report.riskLevel}</span>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <span className="font-bold text-gray-700">Profitability Score: </span>
                <span>{report.profitabilityScore}/100</span>
              </div>
            </div>

            <h3 className="font-bold mt-4">Problem Summary</h3>
            <p className="text-gray-700 mb-2">{report.problemSummary}</p>

            <h3 className="font-bold mt-4">Customer Persona</h3>
            <p className="text-gray-700 mb-2">{report.customerPersona}</p>

            <h3 className="font-bold mt-4">Market Overview</h3>
            <p className="text-gray-700 mb-2">{report.marketOverview}</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-bold">Competitors</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {report.competitorList?.map((comp, i) => <li key={i}>{comp}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-bold">Suggested Tech Stack</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {report.suggestedTechStack?.map((tech, i) => <li key={i}>{tech}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}