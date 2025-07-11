
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Proprietaire, Bien, Mandat, InteractionProprietaire } from '@/types/proprietaire';
import { toast } from 'sonner';

export const useProprietaires = () => {
  const { user } = useAuth();
  const [proprietaires, setProprietaires] = useState<Proprietaire[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProprietaires = async () => {
    if (!user) return;

    try {
      // Utilisation directe avec any en attendant la mise à jour des types
      const { data, error } = await (supabase as any)
        .from('proprietaires')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProprietaires(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des propriétaires:', error);
      toast.error('Erreur lors du chargement des propriétaires');
    } finally {
      setLoading(false);
    }
  };

  const createProprietaire = async (proprietaireData: Omit<Proprietaire, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await (supabase as any)
        .from('proprietaires')
        .insert([{ ...proprietaireData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setProprietaires(prev => [data, ...prev]);
      toast.success('Propriétaire créé avec succès');
      return data;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création du propriétaire');
      return null;
    }
  };

  const updateProprietaire = async (id: string, updates: Partial<Proprietaire>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('proprietaires')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProprietaires(prev => prev.map(p => p.id === id ? data : p));
      toast.success('Propriétaire mis à jour');
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
      return null;
    }
  };

  const deleteProprietaire = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('proprietaires')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProprietaires(prev => prev.filter(p => p.id !== id));
      toast.success('Propriétaire supprimé');
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  };

  const fetchBiensByProprietaire = async (proprietaireId: string): Promise<Bien[]> => {
    try {
      const { data, error } = await (supabase as any)
        .from('biens')
        .select('*')
        .eq('proprietaire_id', proprietaireId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des biens:', error);
      return [];
    }
  };

  const fetchMandatsByProprietaire = async (proprietaireId: string): Promise<Mandat[]> => {
    try {
      const { data, error } = await (supabase as any)
        .from('mandats')
        .select('*')
        .eq('proprietaire_id', proprietaireId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des mandats:', error);
      return [];
    }
  };

  const addInteraction = async (interaction: Omit<InteractionProprietaire, 'id' | 'created_at' | 'conseiller_id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await (supabase as any)
        .from('interactions_proprietaire')
        .insert([{ ...interaction, conseiller_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      toast.success('Interaction enregistrée');
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error('Erreur lors de l\'enregistrement de l\'interaction');
      return null;
    }
  };

  useEffect(() => {
    fetchProprietaires();
  }, [user]);

  return {
    proprietaires,
    loading,
    createProprietaire,
    updateProprietaire,
    deleteProprietaire,
    fetchBiensByProprietaire,
    fetchMandatsByProprietaire,
    addInteraction,
    refetch: fetchProprietaires
  };
};
