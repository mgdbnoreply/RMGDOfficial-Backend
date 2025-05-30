import { useState } from 'react';
import { GameAPI } from '@/services/api';

export default function ApiDebugger() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (method: string, endpoint: string, data?: any) => {
    setLoading(true);
    try {
      let response;
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      response = await fetch(endpoint, options);
      
      const result = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      };

      try {
        const body = await response.text();
        result.body = body ? JSON.parse(body) : null;
      } catch (e) {
        result.body = await response.text();
      }

      setTestResults(prev => ({
        ...prev,
        [`${method}_${endpoint}`]: result
      }));

      console.log(`${method} ${endpoint}:`, result);
    } catch (error) {
      console.error(`${method} ${endpoint} Error:`, error);
      setTestResults(prev => ({
        ...prev,
        [`${method}_${endpoint}`]: { error: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testAllEndpoints = async () => {
    const baseUrl = 'https://u3iysopa88.execute-api.us-east-1.amazonaws.com/games';
    
    // Test GET (should work)
    await testEndpoint('GET', baseUrl);
    
    // Test POST with sample data
    const sampleGame = {
      GameTitle: { S: "Test Game Debug" },
      GameDescription: { S: "This is a test game for debugging" },
      Developer: { S: "Debug Developer" },
      YearDeveloped: { S: "2000" },
      Genre: { S: "Test" },
      Photos: { SS: [] }
    };
    
    await testEndpoint('POST', baseUrl, sampleGame);
    
    // Test OPTIONS (for CORS)
    await testEndpoint('OPTIONS', baseUrl);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-800 border border-white/20 rounded-lg p-4 max-w-md">
        <h3 className="text-white font-bold mb-2">API Debugger</h3>
        <button
          onClick={testAllEndpoints}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
        
        <div className="mt-2 max-h-60 overflow-y-auto">
          {Object.entries(testResults).map(([key, result]: [string, any]) => (
            <div key={key} className="mt-2 p-2 bg-gray-700 rounded text-xs">
              <div className="text-cyan-300 font-mono">{key}</div>
              <div className={`${result.ok ? 'text-green-300' : 'text-red-300'}`}>
                Status: {result.status} {result.statusText}
              </div>
              {result.error && (
                <div className="text-red-300">Error: {result.error}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}