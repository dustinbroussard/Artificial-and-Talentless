
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser, ContentType, HarshnessLevel } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const { preferences, updatePreferences, resetProfile } = useUser();

  const handleResetProfile = () => {
    resetProfile();
    toast.success("Your profile data has been reset");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-typewriter">Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-base">Content Type</Label>
            <RadioGroup 
              defaultValue={preferences.contentType}
              onValueChange={(value) => updatePreferences({ contentType: value as ContentType })}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Insults" id="insults" />
                <Label htmlFor="insults">Insults</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Affirmations" id="affirmations" />
                <Label htmlFor="affirmations">Affirmations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Inspirational" id="inspirational" />
                <Label htmlFor="inspirational">Inspirational</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Random" id="random" />
                <Label htmlFor="random">Random</Label>
              </div>
            </RadioGroup>
          </div>
          
          {preferences.contentType === 'Insults' && (
            <div className="space-y-2">
              <Label className="text-base">Harshness Level</Label>
              <RadioGroup 
                defaultValue={preferences.harshness}
                onValueChange={(value) => updatePreferences({ harshness: value as HarshnessLevel })}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mild" id="mild" />
                  <Label htmlFor="mild">Mild</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Harsh" id="harsh" />
                  <Label htmlFor="harsh">Harsh</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Cruel" id="cruel" />
                  <Label htmlFor="cruel">Cruel</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleResetProfile}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Reset Profile Data
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This will clear all your personalization data and restart the onboarding process.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
