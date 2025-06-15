import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { patientStorage } from '@/lib/localStorage';
import { Patient } from '@/types/hms';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(patient =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  }, [patients, searchTerm]);

  const loadPatients = () => {
    const allPatients = patientStorage.getAll();
    setPatients(allPatients);
  };

  const handleDeletePatient = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const success = patientStorage.delete(id);
      if (success) {
        loadPatients();
        toast({
          title: 'Patient deleted',
          description: `${name} has been removed from the system.`,
        });
      }
    }
  };

  const getAgeFromDateOfBirth = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground">Manage patient records and information</p>
        </div>
        <Button asChild>
          <Link to="/patients/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Patient
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredPatients.length} patients
        </Badge>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {patient.firstName} {patient.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {getAgeFromDateOfBirth(patient.dateOfBirth)} years old • {patient.gender}
                    </p>
                  </div>
                  <Badge variant={patient.bloodGroup ? 'default' : 'secondary'}>
                    {patient.bloodGroup || 'N/A'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{patient.phone}</span>
                  </div>
                </div>

                {patient.allergies && (
                  <div>
                    <p className="text-xs font-medium text-red-600 mb-1">Allergies:</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {patient.allergies}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    Registered {new Date(patient.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-1">
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/patients/${patient.id}/edit`}>
                        <Edit className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePatient(patient.id, `${patient.firstName} ${patient.lastName}`)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
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
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? 'No patients found' : 'No patients registered'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first patient to the system'
              }
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/patients/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Patient
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}