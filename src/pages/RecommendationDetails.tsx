import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EnhancedFertilizerRecommendations from "@/components/EnhancedFertilizerRecommendations";
import { Button as UIButton } from "@/components/ui/button";
import { recommendationService as svc } from "@/services/recommendationService";
import { buildEnhancedRecommendationFromRecord } from "@/services/recommendationBuilder";
import { useLanguage } from "@/contexts/LanguageContext";
import { recommendationService } from "@/services/recommendationService";
import { FertilizerRecommendation } from "@/services/supabaseClient";

const RecommendationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [rec, setRec] = useState<FertilizerRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const { data } = await recommendationService.getRecommendationById(id);
      setRec(data || null);
      setLoading(false);
    };
    load();
  }, [id]);

  const { recommendations, formData } = useMemo(() => {
    if (!rec) return { recommendations: null, formData: null } as any;
    return buildEnhancedRecommendationFromRecord(rec);
  }, [rec]);

  const handleBack = () => navigate(-1);

  const updateStatus = async (status: 'pending' | 'applied' | 'scheduled') => {
    if (!rec) return;
    setUpdating(true);
    const { data } = await svc.updateRecommendationStatus(rec.id, status);
    if (data) setRec(data);
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  if (!rec || !formData || !recommendations) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button onClick={handleBack} variant="outline" size="sm" className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-gray-200 text-black hover:text-black">
              <ArrowLeft className="h-4 w-4" />
              <span className="whitespace-nowrap">{t('common.back')}</span>
            </Button>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('recommendations.title')}</h1>
            <p className="text-sm sm:text-base text-gray-600">{t('recommendations.subtitle')} - {rec.field_name}</p>
          </div>
        </div>

        <EnhancedFertilizerRecommendations recommendations={recommendations as any} formData={formData as any} />

        <div className="mt-6 sm:mt-8 p-4 border rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">{t('dashboard.currentStatus')}</div>
            <div className="text-xs px-2 py-1 rounded border">
              {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-medium mb-2">{t('dashboard.appliedQuestion')}</div>
            <div className="flex gap-2">
              <UIButton disabled={updating} onClick={() => updateStatus('applied')} className="flex-1">{t('common.yes')}</UIButton>
              <UIButton disabled={updating} variant="secondary" onClick={() => updateStatus('pending')} className="flex-1">{t('common.no')}</UIButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationDetails;


