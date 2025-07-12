import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <h1 className="text-6xl font-bold mb-4 text-slate-900">404</h1>
        <p className="text-xl text-slate-600 mb-6">Oops! Page not found</p>
        <p className="text-sm text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-blue-600 text-white">
          <a href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
