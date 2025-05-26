export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 bg-black text-white">
      <div className="w-16 h-16 rounded-full border-4 border-gray-800 border-t-white animate-spin mb-6"></div>
      <p className="text-white font-medium text-lg">Loading your dashboard...</p>
      <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your content</p>
    </div>
  );
}
