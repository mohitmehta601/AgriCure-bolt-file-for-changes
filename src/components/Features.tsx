import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Target, BarChart3, Users, Smartphone, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Target className="h-6 w-6 md:h-8 md:w-8 text-grass-600" />,
      title: t('features.preciseAnalysis.title'),
      description: t('features.preciseAnalysis.description')
    },
    {
      icon: <Leaf className="h-6 w-6 md:h-8 md:w-8 text-grass-600" />,
      title: t('features.smartRecommendations.title'),
      description: t('features.smartRecommendations.description')
    },
    {
      icon: <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-grass-600" />,
      title: t('features.yieldTracking.title'),
      description: t('features.yieldTracking.description')
    },
    {
      icon: <Smartphone className="h-6 w-6 md:h-8 md:w-8 text-grass-600" />,
      title: t('features.mobileDesign.title'),
      description: t('features.mobileDesign.description')
    },
    {
      icon: <Users className="h-6 w-6 md:h-8 md:w-8 text-grass-600" />,
      title: t('features.expertSupport.title'),
      description: t('features.expertSupport.description')
    },
    {
      icon: <Shield className="h-6 w-6 md:h-8 md:w-8 text-grass-600" />,
      title: t('features.dataSecurity.title'),
      description: t('features.dataSecurity.description')
    }
  ];

  return (
    <section id="features" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md h-full">
              <CardHeader className="pb-4">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-lg md:text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-sm md:text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;