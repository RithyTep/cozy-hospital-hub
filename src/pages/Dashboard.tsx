import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { patientApi, doctorApi, appointmentApi } from '@/lib/jsonBlobApi';
import { Users, UserCheck, Calendar, TrendingUp, Plus } from 'lucide-react';
import { Patient, Doctor, Appointment } from '@/types/hms';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todaysAppointments: 0,
  });
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [todaysAppointments, setTodaysAppointments] = useState<(Appointment & { patientName: string; doctorName: string })[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [patients, doctors, appointments] = await Promise.all([
        patientApi.getAll(),
        doctorApi.getAll(),
        appointmentApi.getAll()
      ]);
    
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.date === today);
    
    setStats({
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      totalAppointments: appointments.length,
      todaysAppointments: todayAppointments.length,
    });

    // Get recent patients (last 5)
    const sortedPatients = patients
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    setRecentPatients(sortedPatients);

    // Get today's appointments with patient and doctor names
    const appointmentsWithNames = todayAppointments.map(apt => {
      const patient = patients.find(p => p.id === apt.patientId);
      const doctor = doctors.find(d => d.id === apt.doctorId);
      return {
        ...apt,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient',
        doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor',
      };
    });
    setTodaysAppointments(appointmentsWithNames);
    };
    loadData();
  }, []);

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'text-medical-600',
      bgColor: 'bg-medical-100',
      href: '/patients',
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: UserCheck,
      color: 'text-healthcare-600',
      bgColor: 'bg-healthcare-100',
      href: '/doctors',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/appointments',
    },
    {
      title: "Today's Appointments",
      value: stats.todaysAppointments,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/appointments',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Hospital Management System Overview</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link to="/patients/new">
              <Plus className="h-4 w-4 mr-2" />
              New Patient
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/appointments/new">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={`${stat.title}-${index}`} to={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Patients</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/patients">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPatients.length > 0 ? (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{patient.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No patients registered yet</p>
                <Button asChild className="mt-2" size="sm">
                  <Link to="/patients/new">Register First Patient</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Today's Appointments</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/appointments">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todaysAppointments.length > 0 ? (
              <div className="space-y-3">
                {todaysAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">with {appointment.doctorName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{appointment.time}</p>
                      <p className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === 'scheduled' 
                          ? 'bg-blue-100 text-blue-800' 
                          : appointment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No appointments scheduled for today</p>
                <Button asChild className="mt-2" size="sm">
                  <Link to="/appointments/new">Schedule Appointment</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}