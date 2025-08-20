import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section id="home" className="py-12 md:py-20 lg:py-32 gradient-bg">
      <div className="container mx-auto px-4">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            {t('hero.title')}
            <span className="text-grass-600 block md:inline"> {t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button asChild size="lg" className="bg-grass-600 hover:bg-grass-700 text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
              <Link to="/signup">{t('hero.startTrial')}</Link>
            </Button>
            <Button asChild size="lg" className="bg-grass-600 hover:bg-grass-700 text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
              <Link to="/video">{t('hero.viewDemo')}</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-12 md:mt-16 relative">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
              <div className="p-4">
                <div className="text-2xl md:text-3xl font-bold text-grass-600 mb-2">98%</div>
                <div className="text-gray-600 text-sm md:text-base">{t('hero.accuracyRate')}</div>
              </div>
              <div className="p-4">
                <div className="text-2xl md:text-3xl font-bold text-grass-600 mb-2">25%</div>
                <div className="text-gray-600 text-sm md:text-base">{t('hero.yieldIncrease')}</div>
              </div>
              <div className="p-4">
                <div className="text-2xl md:text-3xl font-bold text-grass-600 mb-2">15+</div>
                <div className="text-gray-600 text-sm md:text-base">{t('hero.cropTypesSupported')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;