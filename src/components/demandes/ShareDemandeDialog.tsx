import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Share2, Loader2, X, Users, Plus, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ShareDemandeDialogProps {
  demandeId: string;
  clientName: string;
}

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
}

interface Share {
  id: string;
  shared_with_user_id: string;
  profile?: Profile;
}

const ShareDemandeDialog: React.FC<ShareDemandeDialogProps> = ({ demandeId, clientName }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [existingShares, setExistingShares] = useState<Share[]>([]);

  useEffect(() => {
    if (open) {
      fetchExistingShares();
    }
  }, [open]);

  const fetchExistingShares = async () => {
    setLoading(true);
    try {
      const { data: sharesData, error: sharesError } = await supabase
        .from('demande_shares')
        .select('id, shared_with_user_id')
        .eq('demande_id', demandeId);

      if (sharesError) throw sharesError;

      if (sharesData && sharesData.length > 0) {
        const userIds = sharesData.map(s => s.shared_with_user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const sharesWithProfiles = sharesData.map(share => ({
          ...share,
          profile: profilesData?.find(p => p.id === share.shared_with_user_id)
        }));

        setExistingShares(sharesWithProfiles);
      } else {
        setExistingShares([]);
      }
    } catch (err) {
      console.error('Error fetching shares:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les partages existants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddByEmail = async () => {
    if (!user || !emailInput.trim()) return;
    
    const email = emailInput.trim().toLowerCase();
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive"
      });
      return;
    }

    setSearching(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .ilike('email', email)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profileData) {
        toast({
          title: "Utilisateur non trouvé",
          description: `Aucun utilisateur enregistré avec l'email "${email}"`,
          variant: "destructive"
        });
        return;
      }

      if (existingShares.some(s => s.shared_with_user_id === profileData.id)) {
        toast({
          title: "Déjà partagé",
          description: "Cette demande est déjà partagée avec cet utilisateur",
          variant: "destructive"
        });
        return;
      }

      if (profileData.id === user.id) {
        toast({
          title: "Erreur",
          description: "Vous ne pouvez pas partager avec vous-même",
          variant: "destructive"
        });
        return;
      }

      const { error: insertError } = await supabase
        .from('demande_shares')
        .insert({
          demande_id: demandeId,
          shared_with_user_id: profileData.id,
          shared_by_user_id: user.id
        });

      if (insertError) throw insertError;

      toast({
        title: "Succès",
        description: `Demande partagée avec ${profileData.full_name || profileData.email}`
      });

      setEmailInput('');
      fetchExistingShares();
    } catch (err) {
      console.error('Error adding share:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le partage",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  const handleRemoveShare = async (shareId: string) => {
    try {
      const { error } = await supabase
        .from('demande_shares')
        .delete()
        .eq('id', shareId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Partage supprimé"
      });

      fetchExistingShares();
    } catch (err) {
      console.error('Error removing share:', err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le partage",
        variant: "destructive"
      });
    }
  };

  const getUserDisplayName = (profile?: Profile) => {
    if (!profile) return 'Utilisateur inconnu';
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
            Partager demande de "{clientName}"
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Entrez l'adresse email d'un utilisateur pour partager cette demande en lecture seule.
          </p>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="email@exemple.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddByEmail()}
                className="pl-9"
              />
            </div>
            <Button 
              onClick={handleAddByEmail} 
              disabled={searching || !emailInput.trim()}
            >
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Partagé avec :</h4>
            
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : existingShares.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Cette demande n'est partagée avec personne
              </p>
            ) : (
              <ScrollArea className="max-h-[200px]">
                <div className="space-y-2">
                  {existingShares.map(share => (
                    <div 
                      key={share.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {getUserDisplayName(share.profile)}
                        </p>
                        {share.profile?.full_name && share.profile?.email && (
                          <p className="text-sm text-muted-foreground truncate">
                            {share.profile.email}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveShare(share.id)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDemandeDialog;
