
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { 
  Proprietaire, 
  Bien, 
  ConditionProprietaire, 
  Mandat, 
  InteractionProprietaire 
} from '@/types/proprietaire';

export const useProprietaires = () => {
  const [proprietaires, setProprietaires] = useState<Proprietaire[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProprietaires = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('proprietaires')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching proprietaires:', error);
    } else {
      setProprietaires(data || []);
    }
    setLoading(false);
  };

  const getProprietaireById = async (id: string): Promise<Proprietaire | null> => {
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
  };

  const addProprietaire = async (proprietaireData: Omit<Proprietaire, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('proprietaires')
      .insert([{
        ...proprietaireData,
        created_by: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    
    await fetchProprietaires();
    return data;
  };

  useEffect(() => {
    fetchProprietaires();
  }, [user]);

  return {
    proprietaires,
    loading,
    fetchProprietaires,
    getProprietaireById,
    addProprietaire
  };
};

export const useBiens = (proprietaireId?: string) => {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBiens = async () => {
    if (!proprietaireId) {
      setBiens([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('biens')
      .select('*')
      .eq('proprietaire_id', proprietaireId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching biens:', error);
    } else {
      setBiens(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBiens();
  }, [proprietaireId]);

  return {
    biens,
    loading,
    refetch: fetchBiens
  };
};

export const useConditions = (proprietaireId?: string) => {
  const [conditions, setConditions] = useState<ConditionProprietaire[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConditions = async () => {
    if (!proprietaireId) {
      setConditions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('conditions_proprietaire')
      .select('*')
      .eq('proprietaire_id', proprietaireId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conditions:', error);
    } else {
      setConditions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConditions();
  }, [proprietaireId]);

  return {
    conditions,
    loading
  };
};

export const useMandats = (proprietaireId?: string) => {
  const [mandats, setMandats] = useState<Mandat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMandats = async () => {
    if (!proprietaireId) {
      setMandats([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('mandats')
      .select('*')
      .eq('proprietaire_id', proprietaireId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching mandats:', error);
    } else {
      setMandats(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMandats();
  }, [proprietaireId]);

  return {
    mandats,
    loading
  };
};

export const useInteractions = (proprietaireId?: string) => {
  const [interactions, setInteractions] = useState<InteractionProprietaire[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInteractions = async () => {
    if (!proprietaireId) {
      setInteractions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('interactions_proprietaire')
      .select('*')
      .eq('proprietaire_id', proprietaireId)
      .order('date_interaction', { ascending: false });

    if (error) {
      console.error('Error fetching interactions:', error);
    } else {
      setInteractions(data || []);
    }
    setLoading(false);
  };

  const addInteraction = async (interactionData: Omit<InteractionProprietaire, 'id' | 'created_at' | 'conseiller_id'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('interactions_proprietaire')
      .insert([{
        ...interactionData,
        conseiller_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    
    await fetchInteractions();
    return data;
  };

  useEffect(() => {
    fetchInteractions();
  }, [proprietaireId]);

  return {
    interactions,
    loading,
    addInteraction
  };
};
