
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserPlus } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name?: string;
}

const InitialAdminSetup = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAdmins, setHasAdmins] = useState(false);

  useEffect(() => {
    checkForAdmins();
    fetchUsers();
  }, []);

  const checkForAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles!inner(name)
        `)
        .eq('roles.name', 'Admin')
        .limit(1);

      if (error) throw error;
      setHasAdmins((data || []).length > 0);
    } catch (error) {
      console.error('Error checking for admins:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('email');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const assignAdminRole = async () => {
    if (!selectedUser) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un utilisateur.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get Admin role ID
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'Admin')
        .single();

      if (roleError) throw roleError;

      // Assign Admin role
      const { error } = await supabase
        .from('user_roles')
        .insert([{
          user_id: selectedUser,
          role_id: roleData.id
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Rôle Admin assigné avec succès.",
      });

      setSelectedUser('');
      checkForAdmins();
    } catch (error: any) {
      console.error('Error assigning admin role:', error);
      if (error.code === '23505') {
        toast({
          title: "Information",
          description: "Cet utilisateur a déjà le rôle Admin.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'assigner le rôle Admin.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (hasAdmins) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-700">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Système configuré</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            Des administrateurs sont déjà configurés. Utilisez la gestion des rôles pour plus de modifications.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <UserPlus className="h-5 w-5" />
          Configuration initiale requise
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-700 mb-4">
          Aucun administrateur n'est configuré. Assignez le rôle Admin à un utilisateur pour commencer.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Utilisateur</label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un utilisateur" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={assignAdminRole} 
            disabled={!selectedUser || isLoading}
            className="w-full"
          >
            {isLoading ? 'Attribution...' : 'Assigner le rôle Admin'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InitialAdminSetup;
