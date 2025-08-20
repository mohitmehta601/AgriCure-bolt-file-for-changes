import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <img src="/logo.png" alt="AgriCure Logo" className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-grass-800">AgriCure</h2>
        </div>

        {/* 404 Content */}
        <h1 className="text-6xl md:text-8xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{t('notFound.title')}</h2>
        <p className="text-lg text-gray-600 mb-8">
          {t('notFound.description')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('notFound.goBack')}</span>
          </Button>
          <Button
            onClick={handleHome}
            className="bg-grass-600 hover:bg-grass-700 flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>{t('notFound.returnHome')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;