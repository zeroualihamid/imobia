import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Share2, Loader2, Trash2, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ShareBienDialogProps {
  bienId: string;
  bienTitle: string;
}

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
}

interface Share {
  id: string;
  shared_with_user_id: string;
  profiles?: Profile;
}

const ShareBienDialog: React.FC<ShareBienDialogProps> = ({ bienId, bienTitle }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [existingShares, setExistingShares] = useState<Share[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all profiles except current user
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .neq('id', user?.id || '');

      if (profilesError) throw profilesError;

      // Fetch existing shares for this bien
      const { data: sharesData, error: sharesError } = await supabase
        .from('bien_shares')
        .select('id, shared_with_user_id')
        .eq('bien_id', bienId);

      if (sharesError) throw sharesError;

      setProfiles(profilesData || []);
      setExistingShares(sharesData || []);
      setSelectedUsers((sharesData || []).map(s => s.shared_with_user_id));
    } catch (err) {
      console.error('Error fetching data:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const existingUserIds = existingShares.map(s => s.shared_with_user_id);
      
      // Find users to add and remove
      const toAdd = selectedUsers.filter(id => !existingUserIds.includes(id));
      const toRemove = existingUserIds.filter(id => !selectedUsers.includes(id));

      // Add new shares
      if (toAdd.length > 0) {
        const newShares = toAdd.map(userId => ({
          bien_id: bienId,
          shared_with_user_id: userId,
          shared_by_user_id: user.id
        }));

        const { error: insertError } = await supabase
          .from('bien_shares')
          .insert(newShares);

        if (insertError) throw insertError;
      }

      // Remove shares
      if (toRemove.length > 0) {
        const sharesToRemove = existingShares
          .filter(s => toRemove.includes(s.shared_with_user_id))
          .map(s => s.id);

        const { error: deleteError } = await supabase
          .from('bien_shares')
          .delete()
          .in('id', sharesToRemove);

        if (deleteError) throw deleteError;
      }

      toast({
        title: "Succès",
        description: "Partage mis à jour avec succès"
      });

      setOpen(false);
    } catch (err) {
      console.error('Error saving shares:', err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le partage",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getUserDisplayName = (profile: Profile) => {
    if (profile.full_name) return profile.full_name;
    if (profile.email) return profile.email;
    return 'Utilisateur inconnu';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Partager "{bienTitle}"
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sélectionnez les utilisateurs avec lesquels partager ce bien. Ils auront un accès en lecture seule.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun autre utilisateur enregistré
            </div>
          ) : (
            <ScrollArea className="h-[300px] border rounded-md p-4">
              <div className="space-y-3">
                {profiles.map(profile => (
                  <div 
                    key={profile.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={profile.id}
                      checked={selectedUsers.includes(profile.id)}
                      onCheckedChange={() => handleToggleUser(profile.id)}
                    />
                    <label 
                      htmlFor={profile.id}
                      className="flex-1 cursor-pointer"
                    >
                      <p className="font-medium">{getUserDisplayName(profile)}</p>
                      {profile.full_name && profile.email && (
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                      )}
                    </label>
                    {existingShares.some(s => s.shared_with_user_id === profile.id) && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        Partagé
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving || loading}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareBienDialog;
