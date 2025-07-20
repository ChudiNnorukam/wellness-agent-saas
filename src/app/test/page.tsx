export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Test Page
        </h1>
        <p className="text-gray-600 text-center">
          If you can see this page, the file structure is working correctly.
        </p>
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
          <h2 className="font-semibold text-emerald-900 mb-2">Environment Variables:</h2>
          <ul className="text-sm text-emerald-800 space-y-1">
            <li>• NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
            <li>• NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</li>
            <li>• NODE_ENV: {process.env.NODE_ENV || '❌ Missing'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 