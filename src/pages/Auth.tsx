
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const Auth = () => {
  const {
    authState,
    signIn,
    signInWithGoogle,
    signUp
  } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  if (authState.session) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.fullName);
        toast.success('Account created! Please check your email for verification.');
      } else {
        await signIn(formData.email, formData.password, rememberMe);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Note: The redirect will happen automatically, so no success toast here
    } catch (error: any) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            variant="outline"
            className="w-full flex items-center gap-3 h-12 text-base font-medium border-2 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 hover:shadow-md"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="flex-1">
              {googleLoading ? 'Signing in...' : `Continue with Google`}
            </span>
          </Button>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-muted-foreground text-sm">
                or continue with email
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                type="text" 
                value={formData.fullName} 
                onChange={e => setFormData(prev => ({
                  ...prev,
                  fullName: e.target.value
                }))} 
                required={isSignUp} 
                disabled={loading || googleLoading} 
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={e => setFormData(prev => ({
              ...prev,
              email: e.target.value
            }))} required disabled={loading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={e => setFormData(prev => ({
              ...prev,
              password: e.target.value
            }))} required disabled={loading} />
          </div>

          {!isSignUp && <div className="flex items-center space-x-2">
              <Checkbox id="rememberMe" checked={rememberMe} onCheckedChange={checked => setRememberMe(checked === true)} />
              <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">Remember me</Label>
            </div>}

          <Button type="submit" className="w-full" disabled={loading || googleLoading}>
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center">
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-sm text-primary hover:underline"
            disabled={loading || googleLoading}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
