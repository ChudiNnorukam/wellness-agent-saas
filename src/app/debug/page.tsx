export default function DebugPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Debug Page</h1>
        <p className="text-gray-600">This is a minimal test page to verify deployment.</p>
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800">✅ If you can see this, the deployment is working!</p>
        </div>
      </div>
    </div>
  );
} 