import { patientStorage, doctorStorage, appointmentStorage } from './localStorage';

export const initializeSampleData = () => {
  // Check if data already exists
  if (patientStorage.getAll().length > 0) return;

  // Sample Patients
  const samplePatients = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      dateOfBirth: '1985-03-15',
      gender: 'male' as const,
      address: '123 Main St, Anytown, ST 12345',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1-555-0124',
      bloodGroup: 'A+',
      allergies: 'Penicillin',
      medicalHistory: 'Hypertension, controlled with medication',
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0125',
      dateOfBirth: '1990-07-22',
      gender: 'female' as const,
      address: '456 Oak Ave, Anytown, ST 12345',
      emergencyContact: 'Mike Johnson',
      emergencyPhone: '+1-555-0126',
      bloodGroup: 'B+',
      allergies: 'None known',
      medicalHistory: 'No significant medical history',
    },
    {
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@email.com',
      phone: '+1-555-0127',
      dateOfBirth: '1978-11-08',
      gender: 'male' as const,
      address: '789 Pine St, Anytown, ST 12345',
      emergencyContact: 'Lisa Chen',
      emergencyPhone: '+1-555-0128',
      bloodGroup: 'O-',
      allergies: 'Shellfish',
      medicalHistory: 'Type 2 Diabetes, well-controlled',
    },
    {
      firstName: 'Emma',
      lastName: 'Williams',
      email: 'emma.williams@email.com',
      phone: '+1-555-0129',
      dateOfBirth: '1995-05-14',
      gender: 'female' as const,
      address: '321 Elm St, Anytown, ST 12345',
      emergencyContact: 'Robert Williams',
      emergencyPhone: '+1-555-0130',
      bloodGroup: 'AB+',
      allergies: 'Latex',
      medicalHistory: 'Asthma, uses inhaler as needed',
    },
  ];

  // Sample Doctors
  const sampleDoctors = [
    {
      firstName: 'Emily',
      lastName: 'Carter',
      email: 'dr.carter@hospital.com',
      phone: '+1-555-0201',
      specialization: 'General Medicine',
      qualification: 'MD, MBBS',
      experience: 8,
      consultationFee: 150,
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    {
      firstName: 'David',
      lastName: 'Rodriguez',
      email: 'dr.rodriguez@hospital.com',
      phone: '+1-555-0202',
      specialization: 'Cardiology',
      qualification: 'MD, Cardiology Fellowship',
      experience: 12,
      consultationFee: 250,
      availability: ['Monday', 'Wednesday', 'Friday'],
    },
    {
      firstName: 'Jennifer',
      lastName: 'Thompson',
      email: 'dr.thompson@hospital.com',
      phone: '+1-555-0203',
      specialization: 'Pediatrics',
      qualification: 'MD, Pediatrics Residency',
      experience: 6,
      consultationFee: 180,
      availability: ['Tuesday', 'Thursday', 'Saturday'],
    },
    {
      firstName: 'Robert',
      lastName: 'Anderson',
      email: 'dr.anderson@hospital.com',
      phone: '+1-555-0204',
      specialization: 'Orthopedics',
      qualification: 'MD, MS Orthopedics',
      experience: 15,
      consultationFee: 300,
      availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    },
  ];

  // Create sample patients
  const createdPatients = samplePatients.map(patient => patientStorage.create(patient));
  
  // Create sample doctors
  const createdDoctors = sampleDoctors.map(doctor => doctorStorage.create(doctor));

  // Sample Appointments
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const sampleAppointments = [
    {
      patientId: createdPatients[0].id,
      doctorId: createdDoctors[0].id,
      date: tomorrow.toISOString().split('T')[0],
      time: '10:00',
      type: 'consultation' as const,
      status: 'scheduled' as const,
      notes: 'Regular checkup for hypertension management',
    },
    {
      patientId: createdPatients[1].id,
      doctorId: createdDoctors[2].id,
      date: nextWeek.toISOString().split('T')[0],
      time: '14:30',
      type: 'consultation' as const,
      status: 'scheduled' as const,
      notes: 'Annual health screening',
    },
    {
      patientId: createdPatients[2].id,
      doctorId: createdDoctors[1].id,
      date: today.toISOString().split('T')[0],
      time: '09:00',
      type: 'followup' as const,
      status: 'completed' as const,
      notes: 'Diabetes follow-up appointment',
    },
    {
      patientId: createdPatients[3].id,
      doctorId: createdDoctors[0].id,
      date: tomorrow.toISOString().split('T')[0],
      time: '15:00',
      type: 'consultation' as const,
      status: 'scheduled' as const,
      notes: 'Asthma medication review',
    },
  ];

  // Create sample appointments
  sampleAppointments.forEach(appointment => appointmentStorage.create(appointment));

  console.log('Sample data initialized successfully!');
};