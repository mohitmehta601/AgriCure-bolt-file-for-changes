import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { UserProfile } from "@/services/supabaseClient";
import { User, Save, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onProfileUpdate: (profile: UserProfile) => void;
}

const ProfileModal = ({ isOpen, onClose, user, onProfileUpdate }: ProfileModalProps) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    full_name: '',
    email: '',
    farm_location: '',
    phone_number: '',
    farm_size: 0,
    farm_size_unit: 'hectares'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && user) {
      loadUserProfile();
    }
  }, [isOpen, user]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await authService.getUserProfile(user.id);
      if (error) throw error;
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: t('common.error'),
        description: t('profile.failedToLoad'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { data, error } = await authService.updateUserProfile(user.id, profile);
      if (error) throw error;

      if (data) {
        onProfileUpdate(data);
        toast({
          title: t('profile.profileUpdated'),
          description: t('profile.profileUpdateSuccess'),
        });
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('common.error'),
        description: t('profile.failedToUpdate'),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-grass-600"></div>
            <span className="ml-2">{t('profile.loadingProfile')}</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-grass-600" />
            <span>{t('profile.editProfile')}</span>
          </DialogTitle>
          <DialogDescription>
            {t('profile.updatePersonalInfo')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="full_name">{t('profile.fullName')} *</Label>
              <Input
                id="full_name"
                value={profile.full_name || ''}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder={t('profile.enterFullName')}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">{t('profile.email')} *</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder={t('profile.enterEmail')}
                required
              />
            </div>

            <div>
              <Label htmlFor="farm_location">{t('profile.farmLocation')}</Label>
              <Input
                id="farm_location"
                value={profile.farm_location || ''}
                onChange={(e) => handleChange('farm_location', e.target.value)}
                placeholder={t('profile.cityStateCountry')}
              />
            </div>

            <div>
              <Label htmlFor="phone_number">{t('profile.phoneNumber')}</Label>
              <Input
                id="phone_number"
                type="tel"
                value={profile.phone_number || ''}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="farm_size">{t('profile.farmSize')}</Label>
                <Input
                  id="farm_size"
                  type="number"
                  step="0.1"
                  min="0"
                  value={profile.farm_size || ''}
                  onChange={(e) => handleChange('farm_size', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label htmlFor="farm_size_unit">{t('profile.unit')}</Label>
                <Select 
                  value={profile.farm_size_unit || 'hectares'} 
                  onValueChange={(value) => handleChange('farm_size_unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hectares">{t('profile.hectares')}</SelectItem>
                    <SelectItem value="acres">{t('profile.acres')}</SelectItem>
                    <SelectItem value="bigha">{t('profile.bigha')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            <X className="h-4 w-4 mr-2" />
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-grass-600 hover:bg-grass-700">
            {isSaving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('profile.saving')}
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t('profile.saveChanges')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;