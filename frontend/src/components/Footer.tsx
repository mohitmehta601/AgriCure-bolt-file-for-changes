import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="AgriCure Logo" className="h-8 w-8" />
              <span className="text-2xl font-bold">AgriCure</span>
            </Link>
            <p className="text-gray-400 text-sm md:text-base">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.product')}</h3>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li><a href="#features" className="hover:text-white transition-colors">{t('footer.features')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.pricing')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.api')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.helpCenter')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.contactUs')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.community')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.about')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.blog')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.careers')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm md:text-base">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;