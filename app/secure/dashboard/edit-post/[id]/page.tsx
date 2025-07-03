import { Clock } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="w-10 h-10 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Coming Soon</h1>
      </div>
      <p className="text-gray-600 text-lg">
        This page is under construction. Stay tuned!
      </p>
    </div>
  );
}
