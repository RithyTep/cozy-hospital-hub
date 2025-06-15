import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { appointmentApi, patientApi, doctorApi } from '@/lib/jsonBlobApi';
import { Appointment, Patient, Doctor } from '@/types/hms';
import { Plus, Search, Calendar, Clock, User, UserCheck, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredAppointments, setFilteredAppointments] = useState<(Appointment & { patientName: string; doctorName: string })[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const appointmentsWithNames = appointments.map(apt => {
      const patient = patients.find(p => p.id === apt.patientId);
      const doctor = doctors.find(d => d.id === apt.doctorId);
      return {
        ...apt,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient',
        doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor',
      };
    });

    let filtered = appointmentsWithNames;

    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredAppointments(filtered);
  }, [appointments, patients, doctors, searchTerm, statusFilter]);

  const loadData = async () => {
    const [appointmentsData, patientsData, doctorsData] = await Promise.all([
      appointmentApi.getAll(),
      patientApi.getAll(),
      doctorApi.getAll()
    ]);
    setAppointments(appointmentsData);
    setPatients(patientsData);
    setDoctors(doctorsData);
  };

  const handleStatusUpdate = async (id: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    const success = await appointmentApi.update(id, { status: newStatus });
    if (success) {
      loadData();
      toast({
        title: 'Appointment updated',
        description: `Appointment status changed to ${newStatus}.`,
      });
    }
  };

  const handleDeleteAppointment = async (id: string, patientName: string) => {
    if (window.confirm(`Are you sure you want to delete the appointment for ${patientName}?`)) {
      const success = await appointmentApi.delete(id);
      if (success) {
        loadData();
        toast({
          title: 'Appointment deleted',
          description: 'The appointment has been removed from the system.',
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-medical-100 text-medical-800';
      case 'followup':
        return 'bg-healthcare-100 text-healthcare-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isUpcoming = (date: string, time: string) => {
    const appointmentDate = new Date(`${date} ${time}`);
    return appointmentDate > new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">Manage patient appointments and schedules</p>
        </div>
        <Button asChild>
          <Link to="/appointments/new">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="text-sm">
          {filteredAppointments.length} appointments
        </Badge>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-medical-600" />
                        <span className="font-medium text-foreground">
                          {appointment.patientName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 text-healthcare-600" />
                        <span className="text-muted-foreground">
                          {appointment.doctorName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(appointment.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                      {isUpcoming(appointment.date, appointment.time) && (
                        <Badge variant="secondary" className="text-xs">
                          Upcoming
                        </Badge>
                      )}
                    </div>

                    {appointment.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {appointment.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <div className="flex space-x-2">
                      <Badge className={getTypeColor(appointment.type)}>
                        {appointment.type}
                      </Badge>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>

                    <div className="flex space-x-2">
                      {appointment.status === 'scheduled' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                            className="text-green-600 hover:text-green-700"
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                            className="text-red-600 hover:text-red-700"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAppointment(appointment.id, appointment.patientName)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No appointments found' : 'No appointments scheduled'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by scheduling your first appointment'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button asChild>
                <Link to="/appointments/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule First Appointment
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}