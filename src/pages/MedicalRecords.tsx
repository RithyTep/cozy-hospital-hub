import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { patientStorage, doctorStorage, appointmentStorage } from '@/lib/localStorage';
import { FileText, Search, Plus, Eye, Printer } from 'lucide-react';
import { Patient, Doctor, Appointment } from '@/types/hms';

export default function MedicalRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    setAppointments(appointmentStorage.getAll());
    setPatients(patientStorage.getAll());
    setDoctors(doctorStorage.getAll());
  }, []);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor';
  };

  const filteredRecords = appointments.filter(appointment => {
    const patientName = getPatientName(appointment.patientId).toLowerCase();
    const doctorName = getDoctorName(appointment.doctorId).toLowerCase();
    return (
      patientName.includes(searchTerm.toLowerCase()) ||
      doctorName.includes(searchTerm.toLowerCase()) ||
      appointment.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medical Records</h1>
          <p className="text-muted-foreground">Patient appointment history and medical notes</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative print:hidden">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by patient name, doctor, or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Records Grid */}
      <div className="grid gap-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <Card key={record.id} className="print:shadow-none print:border print:break-inside-avoid">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{getPatientName(record.patientId)}</CardTitle>
                  <Badge variant={record.status === 'completed' ? 'default' : record.status === 'scheduled' ? 'secondary' : 'destructive'}>
                    {record.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Doctor</p>
                    <p className="text-foreground">{getDoctorName(record.doctorId)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Date & Time</p>
                    <p className="text-foreground">{new Date(record.date).toLocaleDateString()} at {record.time}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Type</p>
                    <p className="text-foreground capitalize">{record.type}</p>
                  </div>
                </div>
                {record.notes && (
                  <div className="mt-4">
                    <p className="font-medium text-muted-foreground mb-1">Notes</p>
                    <p className="text-foreground text-sm">{record.notes}</p>
                  </div>
                )}
                <div className="mt-3 text-xs text-muted-foreground">
                  Record created: {new Date(record.createdAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 print:hidden">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">No medical records found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'No records match your search criteria.' : 'No medical records available yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}