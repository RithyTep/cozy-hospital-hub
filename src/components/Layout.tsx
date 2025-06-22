
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  LogOut, 
  Users, 
  Stethoscope, 
  Calendar, 
  FileText, 
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { logout, currentUser } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Doctors', href: '/doctors', icon: Stethoscope },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Medical Records', href: '/medical-records', icon: FileText },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-medical-600 to-healthcare-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-medical-700 to-healthcare-700 bg-clip-text text-transparent">
                  Hospital Management
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">Healthcare System</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-medical-500 to-healthcare-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {currentUser?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">Welcome, {currentUser}</span>
              </div>

              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white/80 backdrop-blur-md border-r border-gray-200/50 min-h-[calc(100vh-4rem)] shadow-sm">
          <div className="p-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-medical-100 to-healthcare-100 text-medical-700 border border-medical-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-medical-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-medical-500 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
