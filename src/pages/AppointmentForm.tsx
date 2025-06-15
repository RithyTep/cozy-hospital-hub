import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { appointmentStorage, patientStorage, doctorStorage } from '@/lib/localStorage';
import { Patient, Doctor } from '@/types/hms';
import { ArrowLeft, Save, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AppointmentForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: '' as 'consultation' | 'followup' | 'emergency' | '',
    notes: '',
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPatients(patientStorage.getAll());
    setDoctors(doctorStorage.getAll());
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time || !formData.type) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }

      // Check if appointment time is in the future
      const appointmentDateTime = new Date(`${formData.date} ${formData.time}`);
      if (appointmentDateTime <= new Date()) {
        toast({
          title: 'Invalid Date/Time',
          description: 'Please select a future date and time.',
          variant: 'destructive',
        });
        return;
      }

      appointmentStorage.create({
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.time,
        type: formData.type as 'consultation' | 'followup' | 'emergency',
        notes: formData.notes,
        status: 'scheduled',
      });

      const patient = patients.find(p => p.id === formData.patientId);
      const doctor = doctors.find(d => d.id === formData.doctorId);

      toast({
        title: 'Appointment scheduled',
        description: `Appointment for ${patient?.firstName} ${patient?.lastName} with Dr. ${doctor?.firstName} ${doctor?.lastName} has been scheduled.`,
      });

      navigate('/appointments');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/appointments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Appointments
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schedule Appointment</h1>
          <p className="text-muted-foreground">Create a new appointment in the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient & Doctor Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Patient & Doctor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patientId">Patient *</Label>
                <Select value={formData.patientId} onValueChange={(value) => handleInputChange('patientId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} - {patient.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {patients.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No patients found. <Button asChild variant="link" className="p-0 h-auto text-sm">
                      <Link to="/patients/new">Add a patient first</Link>
                    </Button>
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="doctorId">Doctor *</Label>
                <Select value={formData.doctorId} onValueChange={(value) => handleInputChange('doctorId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {doctors.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No doctors found. <Button asChild variant="link" className="p-0 h-auto text-sm">
                      <Link to="/doctors/new">Add a doctor first</Link>
                    </Button>
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="type">Appointment Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Date, Time & Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={getMinDate()}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="time">Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes or special instructions..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/appointments')}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading || patients.length === 0 || doctors.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Scheduling...' : 'Schedule Appointment'}
          </Button>
        </div>
      </form>
    </div>
  );
}