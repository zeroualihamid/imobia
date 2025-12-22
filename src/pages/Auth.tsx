import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Auth = () => {
  const { t, isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error(t('auth.accountExists'));
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success(t('auth.accountCreated'));
      }
    } catch (error) {
      toast.error(t('message.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error(t('auth.loginError'));
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success(t('auth.loginSuccess'));
        navigate('/');
      }
    } catch (error) {
      toast.error(t('message.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md bg-white border border-slate-200 shadow-lg">
        <CardHeader className="text-center pb-4 bg-white">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            {t('auth.title')}
          </CardTitle>
          <CardDescription className="text-slate-600 font-medium">
            {t('auth.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 border border-slate-200 p-1">
              <TabsTrigger 
                value="signin" 
                className="text-sm text-slate-700 font-medium bg-white data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm border-slate-200"
              >
                {t('auth.login')}
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="text-sm text-slate-700 font-medium bg-white data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm border-slate-200"
              >
                {t('auth.register')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-slate-900 font-medium">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className={cn("absolute top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4", isRTL ? "right-3" : "left-3")} />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn("bg-white border-slate-300 text-slate-900 placeholder:text-slate-500", isRTL ? "pr-10" : "pl-10")}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-slate-900 font-medium">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className={cn("absolute top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4", isRTL ? "right-3" : "left-3")} />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn("bg-white border-slate-300 text-slate-900 placeholder:text-slate-500", isRTL ? "pr-10" : "pl-10")}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.loggingIn') : t('auth.loginBtn')}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-slate-900 font-medium">{t('auth.fullName')}</Label>
                  <div className="relative">
                    <User className={cn("absolute top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4", isRTL ? "right-3" : "left-3")} />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder={t('auth.fullName')}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={cn("bg-white border-slate-300 text-slate-900 placeholder:text-slate-500", isRTL ? "pr-10" : "pl-10")}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-slate-900 font-medium">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className={cn("absolute top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4", isRTL ? "right-3" : "left-3")} />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn("bg-white border-slate-300 text-slate-900 placeholder:text-slate-500", isRTL ? "pr-10" : "pl-10")}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-slate-900 font-medium">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className={cn("absolute top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4", isRTL ? "right-3" : "left-3")} />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn("bg-white border-slate-300 text-slate-900 placeholder:text-slate-500", isRTL ? "pr-10" : "pl-10")}
                      required
                      minLength={6}
                    />
                  </div>
                  <p className={cn("text-xs text-slate-600 font-medium", isRTL && "text-right")}>
                    {t('auth.passwordMinLength')}
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.creating') : t('auth.registerBtn')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className={cn("flex items-start space-x-3", isRTL && "space-x-reverse flex-row-reverse")}>
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className={cn("text-sm text-blue-800", isRTL && "text-right")}>
                <p className="font-semibold mb-1">{t('auth.devNote')}</p>
                <p className="font-medium">{t('auth.devNoteText')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
