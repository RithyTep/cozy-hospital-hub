import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { doctorApi } from '@/lib/jsonBlobApi';
import { Doctor } from '@/types/hms';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DoctorForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: 0,
    consultationFee: 0,
    availability: [] as string[],
    profileImage: '',
  });

  const [loading, setLoading] = useState(false);

  const weekDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics',
    'Neurology',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Gynecology',
    'Ophthalmology',
    'ENT',
    'Anesthesiology',
    'Emergency Medicine',
  ];

  useEffect(() => {
    if (isEditing && id) {
      doctorApi.getById(id).then(doctor => {
        if (doctor) {
          setFormData({
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            email: doctor.email,
            phone: doctor.phone,
            specialization: doctor.specialization,
            qualification: doctor.qualification,
            experience: doctor.experience,
            consultationFee: doctor.consultationFee,
            availability: doctor.availability,
            profileImage: doctor.profileImage || '',
          });
        }
      });
    }
  }, [isEditing, id]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: checked
        ? [...prev.availability, day]
        : prev.availability.filter(d => d !== day)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && id) {
        await doctorApi.update(id, formData as Partial<Doctor>);
        toast({
          title: 'Doctor updated',
          description: `Dr. ${formData.firstName} ${formData.lastName} has been updated successfully.`,
        });
      } else {
        await doctorApi.create(formData as Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>);
        toast({
          title: 'Doctor added',
          description: `Dr. ${formData.firstName} ${formData.lastName} has been added to the system.`,
        });
      }
      navigate('/doctors');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/doctors')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Doctors
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update doctor information' : 'Register a new doctor in the system'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  list="specializations"
                  required
                />
                <datalist id="specializations">
                  {specializations.map((spec) => (
                    <option key={spec} value={spec} />
                  ))}
                </datalist>
              </div>

              <div>
                <Label htmlFor="profileImage">Profile Image (URL)</Label>
                <Input
                  id="profileImage"
                  value={formData.profileImage}
                  onChange={(e) => handleInputChange('profileImage', e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>

              <div>
                <Label htmlFor="qualification">Qualification *</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  placeholder="e.g., MBBS, MD, MS"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="experience">Years of Experience *</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="consultationFee">Consultation Fee ($) *</Label>
                <Input
                  id="consultationFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.consultationFee}
                  onChange={(e) => handleInputChange('consultationFee', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <Label className="text-base font-medium">Availability *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select the days when this doctor is available
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {weekDays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={formData.availability.includes(day)}
                        onCheckedChange={(checked) => 
                          handleAvailabilityChange(day, checked as boolean)
                        }
                      />
                      <Label htmlFor={day} className="text-sm font-normal">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/doctors')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : isEditing ? 'Update Doctor' : 'Add Doctor'}
          </Button>
        </div>
      </form>
    </div>
  );
}