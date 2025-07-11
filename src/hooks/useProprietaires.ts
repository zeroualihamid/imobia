
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Proprietaire, Bien, ConditionProprietaire, Mandat, InteractionProprietaire } from '@/types/proprietaire';

export const useProprietaires = () => {
  const [proprietaires, setProprietaires] = useState<Proprietaire[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProprietaires();
    }
  }, [user]);

  const fetchProprietaires = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('proprietaires')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching proprietaires:', error);
        toast.error('Erreur lors du chargement des propriétaires');
        return;
      }

      setProprietaires(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors du chargement des propriétaires');
    } finally {
      setLoading(false);
    }
  };

  const createProprietaire = async (proprietaireData: Omit<Proprietaire, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('proprietaires')
        .insert([{
          ...proprietaireData,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating proprietaire:', error);
        toast.error('Erreur lors de la création du propriétaire');
        return null;
      }

      toast.success('Propriétaire créé avec succès');
      await fetchProprietaires();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la création du propriétaire');
      return null;
    }
  };

  const updateProprietaire = async (id: string, proprietaireData: Partial<Proprietaire>) => {
    try {
      const { data, error } = await supabase
        .from('proprietaires')
        .update(proprietaireData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating proprietaire:', error);
        toast.error('Erreur lors de la mise à jour du propriétaire');
        return null;
      }

      toast.success('Propriétaire mis à jour avec succès');
      await fetchProprietaires();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la mise à jour du propriétaire');
      return null;
    }
  };

  const deleteProprietaire = async (id: string) => {
    try {
      const { error } = await supabase
        .from('proprietaires')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting proprietaire:', error);
        toast.error('Erreur lors de la suppression du propriétaire');
        return false;
      }

      toast.success('Propriétaire supprimé avec succès');
      await fetchProprietaires();
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la suppression du propriétaire');
      return false;
    }
  };

  const getProprietaireById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('proprietaires')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching proprietaire:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  return {
    proprietaires,
    loading,
    createProprietaire,
    updateProprietaire,
    deleteProprietaire,
    getProprietaireById,
    fetchProprietaires
  };
};

export const useBiens = (proprietaireId?: string) => {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (proprietaireId) {
      fetchBiens();
    }
  }, [proprietaireId]);

  const fetchBiens = async () => {
    if (!proprietaireId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('biens')
        .select('*')
        .eq('proprietaire_id', proprietaireId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching biens:', error);
        toast.error('Erreur lors du chargement des biens');
        return;
      }

      setBiens(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors du chargement des biens');
    } finally {
      setLoading(false);
    }
  };

  const createBien = async (bienData: Omit<Bien, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('biens')
        .insert([bienData])
        .select()
        .single();

      if (error) {
        console.error('Error creating bien:', error);
        toast.error('Erreur lors de la création du bien');
        return null;
      }

      toast.success('Bien créé avec succès');
      await fetchBiens();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la création du bien');
      return null;
    }
  };

  return {
    biens,
    loading,
    createBien,
    fetchBiens
  };
};

export const useConditions = (proprietaireId?: string) => {
  const [conditions, setConditions] = useState<ConditionProprietaire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (proprietaireId) {
      fetchConditions();
    }
  }, [proprietaireId]);

  const fetchConditions = async () => {
    if (!proprietaireId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conditions_proprietaire')
        .select('*')
        .eq('proprietaire_id', proprietaireId);

      if (error) {
        console.error('Error fetching conditions:', error);
        toast.error('Erreur lors du chargement des conditions');
        return;
      }

      setConditions(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors du chargement des conditions');
    } finally {
      setLoading(false);
    }
  };

  const createCondition = async (conditionData: Omit<ConditionProprietaire, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('conditions_proprietaire')
        .insert([conditionData])
        .select()
        .single();

      if (error) {
        console.error('Error creating condition:', error);
        toast.error('Erreur lors de la création de la condition');
        return null;
      }

      toast.success('Condition créée avec succès');
      await fetchConditions();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la création de la condition');
      return null;
    }
  };

  return {
    conditions,
    loading,
    createCondition,
    fetchConditions
  };
};

export const useMandats = (proprietaireId?: string) => {
  const [mandats, setMandats] = useState<Mandat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (proprietaireId) {
      fetchMandats();
    }
  }, [proprietaireId]);

  const fetchMandats = async () => {
    if (!proprietaireId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mandats')
        .select('*')
        .eq('proprietaire_id', proprietaireId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mandats:', error);
        toast.error('Erreur lors du chargement des mandats');
        return;
      }

      setMandats(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors du chargement des mandats');
    } finally {
      setLoading(false);
    }
  };

  const createMandat = async (mandatData: Omit<Mandat, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('mandats')
        .insert([{
          ...mandatData,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating mandat:', error);
        toast.error('Erreur lors de la création du mandat');
        return null;
      }

      toast.success('Mandat créé avec succès');
      await fetchMandats();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la création du mandat');
      return null;
    }
  };

  return {
    mandats,
    loading,
    createMandat,
    fetchMandats
  };
};

export const useInteractions = (proprietaireId?: string) => {
  const [interactions, setInteractions] = useState<InteractionProprietaire[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (proprietaireId) {
      fetchInteractions();
    }
  }, [proprietaireId]);

  const fetchInteractions = async () => {
    if (!proprietaireId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interactions_proprietaire')
        .select('*')
        .eq('proprietaire_id', proprietaireId)
        .order('date_interaction', { ascending: false });

      if (error) {
        console.error('Error fetching interactions:', error);
        toast.error('Erreur lors du chargement des interactions');
        return;
      }

      setInteractions(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors du chargement des interactions');
    } finally {
      setLoading(false);
    }
  };

  const addInteraction = async (interactionData: Omit<InteractionProprietaire, 'id' | 'created_at' | 'conseiller_id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('interactions_proprietaire')
        .insert([{
          ...interactionData,
          conseiller_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating interaction:', error);
        toast.error('Erreur lors de l\'ajout de l\'interaction');
        return null;
      }

      toast.success('Interaction ajoutée avec succès');
      await fetchInteractions();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de l\'ajout de l\'interaction');
      return null;
    }
  };

  return {
    interactions,
    loading,
    addInteraction,
    fetchInteractions
  };
};
