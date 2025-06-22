
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Lock, User, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome to Hospital Management System',
        });
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid username or password. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login Error',
        description: 'An error occurred during login. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-healthcare-50 to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8 pt-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-r from-medical-600 to-healthcare-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <span className="text-3xl font-bold bg-gradient-to-r from-medical-700 to-healthcare-700 bg-clip-text text-transparent">HMS</span>
              <p className="text-sm text-muted-foreground -mt-1">Healthcare System</p>
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-800">Admin Portal</CardTitle>
          <p className="text-muted-foreground mt-2">Secure access to hospital management</p>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Shield className="h-4 w-4 text-medical-600" />
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-11 h-12 border-2 focus:border-medical-500 transition-colors"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="h-4 w-4 text-medical-600" />
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 border-2 focus:border-medical-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-medical-600 to-healthcare-600 hover:from-medical-700 hover:to-healthcare-700 text-white font-medium shadow-lg transition-all duration-200 transform hover:scale-[1.02]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Secured with enterprise-grade authentication
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
