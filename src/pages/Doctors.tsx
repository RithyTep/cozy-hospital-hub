import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { doctorStorage } from '@/lib/localStorage';
import { Doctor } from '@/types/hms';
import { Plus, Search, Edit, Trash2, Phone, Mail, GraduationCap, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.phone.includes(searchTerm)
    );
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm]);

  const loadDoctors = () => {
    const allDoctors = doctorStorage.getAll();
    setDoctors(allDoctors);
  };

  const handleDeleteDoctor = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete Dr. ${name}?`)) {
      const success = doctorStorage.delete(id);
      if (success) {
        loadDoctors();
        toast({
          title: 'Doctor removed',
          description: `Dr. ${name} has been removed from the system.`,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctors</h1>
          <p className="text-muted-foreground">Manage doctor profiles and specializations</p>
        </div>
        <Button asChild>
          <Link to="/doctors/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Doctor
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredDoctors.length} doctors
        </Badge>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </CardTitle>
                    <p className="text-sm text-healthcare-600 font-medium">
                      {doctor.specialization}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {doctor.experience}y exp
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{doctor.qualification}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>${doctor.consultationFee} consultation fee</span>
                  </div>
                </div>

                {doctor.availability.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-healthcare-600 mb-1">Available:</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.availability.slice(0, 3).map((day) => (
                        <Badge key={day} variant="secondary" className="text-xs">
                          {day}
                        </Badge>
                      ))}
                      {doctor.availability.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{doctor.availability.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    Added {new Date(doctor.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-1">
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/doctors/${doctor.id}/edit`}>
                        <Edit className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDoctor(doctor.id, `${doctor.firstName} ${doctor.lastName}`)}
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
              {searchTerm ? 'No doctors found' : 'No doctors registered'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first doctor to the system'
              }
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/doctors/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Doctor
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}