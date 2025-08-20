import { MapPin, Cloud, Brain, Smartphone, LucideIcon } from "lucide-react";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Step {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
  color: string;
}

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();
  
  const steps: Step[] = [
    {
      icon: MapPin,
      number: "01",
      title: t('howItWorks.deploySensors.title'),
      description: t('howItWorks.deploySensors.description'),
      color: "bg-primary"
    },
    {
      icon: Cloud,
      number: "02",
      title: t('howItWorks.streamData.title'),
      description: t('howItWorks.streamData.description'),
      color: "bg-blue-500"
    },
    {
      icon: Brain,
      number: "03",
      title: t('howItWorks.mlRecommends.title'),
      description: t('howItWorks.mlRecommends.description'),
      color: "bg-accent"
    },
    {
      icon: Smartphone,
      number: "04",
      title: t('howItWorks.applyDashboard.title'),
      description: t('howItWorks.applyDashboard.description'),
      color: "bg-purple-500"
    }
  ];

  return (
    <section id="how-it-works" className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-4 animate-fade-in">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection line - hidden on mobile, visible on large screens */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-300 transform translate-x-4 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              )}

              <div
                className="relative z-10 text-center group-hover:scale-105 transition-transform duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 md:p-6 rounded-2xl ${step.color} text-white mb-4 md:mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  {React.createElement(step.icon, { className: "h-6 w-6 md:h-8 md:w-8" })}
                </div>

                {/* Step number */}
                <div className="text-sm font-bold text-gray-400 mb-2">
                  {t('howItWorks.step')} {step.number}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg md:text-xl text-gray-900 mb-3 md:mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;