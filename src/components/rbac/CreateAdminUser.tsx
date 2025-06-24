
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Shield } from 'lucide-react';

const CreateAdminUser = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('admin@imobia.com');
  const [password, setPassword] = useState('admin');
  const [fullName, setFullName] = useState('Administrator');
  const [isLoading, setIsLoading] = useState(false);

  const createAdminUser = async () => {
    setIsLoading(true);
    try {
      // Create the user account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        // Get Admin role ID
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'Admin')
          .single();

        if (roleError) throw roleError;

        // Assign Admin role to the user
        const { error: roleAssignError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: signUpData.user.id,
            role_id: roleData.id
          }]);

        if (roleAssignError) throw roleAssignError;

        toast({
          title: "Succès",
          description: `Utilisateur admin créé avec succès! Email: ${email}`,
        });

        // Clear form
        setEmail('');
        setPassword('');
        setFullName('');
      }
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'utilisateur admin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <UserPlus className="h-5 w-5" />
          Créer un utilisateur Admin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-700 mb-4">
          Créez un utilisateur administrateur pour gérer les rôles et permissions.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom complet</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Administrator"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@imobia.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin"
            />
          </div>
          
          <Button 
            onClick={createAdminUser} 
            disabled={!email || !password || !fullName || isLoading}
            className="w-full"
          >
            <Shield className="h-4 w-4 mr-2" />
            {isLoading ? 'Création...' : 'Créer Admin'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateAdminUser;
