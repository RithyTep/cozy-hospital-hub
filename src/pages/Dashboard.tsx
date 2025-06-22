
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Stethoscope, Calendar, FileText, TrendingUp, Activity, Clock, AlertCircle } from 'lucide-react';
import { patientApi, doctorApi, appointmentApi } from '@/lib/jsonBlobApi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [patients, doctors, appointments] = await Promise.all([
          patientApi.getAll(),
          doctorApi.getAll(),
          appointmentApi.getAll(),
        ]);

        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(
          (apt) => apt.date === today
        ).length;

        setStats({
          totalPatients: patients.length,
          totalDoctors: doctors.length,
          totalAppointments: appointments.length,
          todayAppointments,
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: Stethoscope,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Today\'s Appointments',
      value: stats.todayAppointments,
      icon: Clock,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      change: '+5%',
      changeType: 'positive'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening at your hospital today.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
          <Activity className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-gray-700">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}></div>
            <CardHeader className="relative flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-medical-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New patient registered', time: '2 minutes ago', type: 'patient' },
                { action: 'Appointment scheduled', time: '15 minutes ago', type: 'appointment' },
                { action: 'Medical record updated', time: '1 hour ago', type: 'record' },
                { action: 'Doctor added to system', time: '2 hours ago', type: 'doctor' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'patient' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'appointment' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'record' ? 'bg-green-100 text-green-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {activity.type === 'patient' && <Users className="h-4 w-4" />}
                    {activity.type === 'appointment' && <Calendar className="h-4 w-4" />}
                    {activity.type === 'record' && <FileText className="h-4 w-4" />}
                    {activity.type === 'doctor' && <Stethoscope className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-healthcare-600" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Add Patient', icon: Users, href: '/patients/new', color: 'blue' },
                { label: 'Add Doctor', icon: Stethoscope, href: '/doctors/new', color: 'green' },
                { label: 'Schedule Appointment', icon: Calendar, href: '/appointments/new', color: 'purple' },
                { label: 'View Records', icon: FileText, href: '/medical-records', color: 'orange' },
              ].map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className={`p-4 rounded-xl border-2 border-dashed hover:border-solid transition-all duration-200 hover:shadow-md group ${
                    action.color === 'blue' ? 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' :
                    action.color === 'green' ? 'border-green-200 hover:border-green-400 hover:bg-green-50' :
                    action.color === 'purple' ? 'border-purple-200 hover:border-purple-400 hover:bg-purple-50' :
                    'border-orange-200 hover:border-orange-400 hover:bg-orange-50'
                  }`}
                >
                  <div className="text-center">
                    <action.icon className={`h-8 w-8 mx-auto mb-2 ${
                      action.color === 'blue' ? 'text-blue-500 group-hover:text-blue-600' :
                      action.color === 'green' ? 'text-green-500 group-hover:text-green-600' :
                      action.color === 'purple' ? 'text-purple-500 group-hover:text-purple-600' :
                      'text-orange-500 group-hover:text-orange-600'
                    }`} />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {action.label}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-green-600" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Server Status</h3>
              <p className="text-sm text-green-600 font-medium">Online</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Database</h3>
              <p className="text-sm text-blue-600 font-medium">Connected</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Performance</h3>
              <p className="text-sm text-purple-600 font-medium">Optimal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
