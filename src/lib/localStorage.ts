import { Patient, Doctor, Appointment, MedicalRecord } from '@/types/hms';

const STORAGE_KEYS = {
  PATIENTS: 'hms_patients',
  DOCTORS: 'hms_doctors',
  APPOINTMENTS: 'hms_appointments',
  MEDICAL_RECORDS: 'hms_medical_records',
} as const;

// Generic localStorage functions
function getFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error);
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error);
  }
}

// Patient functions
export const patientStorage = {
  getAll: (): Patient[] => getFromStorage<Patient>(STORAGE_KEYS.PATIENTS),
  
  getById: (id: string): Patient | undefined => {
    const patients = getFromStorage<Patient>(STORAGE_KEYS.PATIENTS);
    return patients.find(patient => patient.id === id);
  },
  
  create: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient => {
    const patients = getFromStorage<Patient>(STORAGE_KEYS.PATIENTS);
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    patients.push(newPatient);
    saveToStorage(STORAGE_KEYS.PATIENTS, patients);
    return newPatient;
  },
  
  update: (id: string, updates: Partial<Patient>): Patient | null => {
    const patients = getFromStorage<Patient>(STORAGE_KEYS.PATIENTS);
    const index = patients.findIndex(patient => patient.id === id);
    if (index === -1) return null;
    
    patients[index] = {
      ...patients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.PATIENTS, patients);
    return patients[index];
  },
  
  delete: (id: string): boolean => {
    const patients = getFromStorage<Patient>(STORAGE_KEYS.PATIENTS);
    const filtered = patients.filter(patient => patient.id !== id);
    if (filtered.length === patients.length) return false;
    saveToStorage(STORAGE_KEYS.PATIENTS, filtered);
    return true;
  },
};

// Doctor functions
export const doctorStorage = {
  getAll: (): Doctor[] => getFromStorage<Doctor>(STORAGE_KEYS.DOCTORS),
  
  getById: (id: string): Doctor | undefined => {
    const doctors = getFromStorage<Doctor>(STORAGE_KEYS.DOCTORS);
    return doctors.find(doctor => doctor.id === id);
  },
  
  create: (doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Doctor => {
    const doctors = getFromStorage<Doctor>(STORAGE_KEYS.DOCTORS);
    const newDoctor: Doctor = {
      ...doctor,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    doctors.push(newDoctor);
    saveToStorage(STORAGE_KEYS.DOCTORS, doctors);
    return newDoctor;
  },
  
  update: (id: string, updates: Partial<Doctor>): Doctor | null => {
    const doctors = getFromStorage<Doctor>(STORAGE_KEYS.DOCTORS);
    const index = doctors.findIndex(doctor => doctor.id === id);
    if (index === -1) return null;
    
    doctors[index] = {
      ...doctors[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.DOCTORS, doctors);
    return doctors[index];
  },
  
  delete: (id: string): boolean => {
    const doctors = getFromStorage<Doctor>(STORAGE_KEYS.DOCTORS);
    const filtered = doctors.filter(doctor => doctor.id !== id);
    if (filtered.length === doctors.length) return false;
    saveToStorage(STORAGE_KEYS.DOCTORS, filtered);
    return true;
  },
};

// Appointment functions
export const appointmentStorage = {
  getAll: (): Appointment[] => getFromStorage<Appointment>(STORAGE_KEYS.APPOINTMENTS),
  
  getById: (id: string): Appointment | undefined => {
    const appointments = getFromStorage<Appointment>(STORAGE_KEYS.APPOINTMENTS);
    return appointments.find(appointment => appointment.id === id);
  },
  
  getByPatientId: (patientId: string): Appointment[] => {
    const appointments = getFromStorage<Appointment>(STORAGE_KEYS.APPOINTMENTS);
    return appointments.filter(appointment => appointment.patientId === patientId);
  },
  
  getByDoctorId: (doctorId: string): Appointment[] => {
    const appointments = getFromStorage<Appointment>(STORAGE_KEYS.APPOINTMENTS);
    return appointments.filter(appointment => appointment.doctorId === doctorId);
  },
  
  create: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment => {
    const appointments = getFromStorage<Appointment>(STORAGE_KEYS.APPOINTMENTS);
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    appointments.push(newAppointment);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
    return newAppointment;
  },
  
  update: (id: string, updates: Partial<Appointment>): Appointment | null => {
    const appointments = getFromStorage<Appointment>(STORAGE_KEYS.APPOINTMENTS);
    const index = appointments.findIndex(appointment => appointment.id === id);
    if (index === -1) return null;
    
    appointments[index] = {
      ...appointments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
    return appointments[index];
  },
  
  delete: (id: string): boolean => {
    const appointments = getFromStorage<Appointment>(STORAGE_KEYS.APPOINTMENTS);
    const filtered = appointments.filter(appointment => appointment.id !== id);
    if (filtered.length === appointments.length) return false;
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, filtered);
    return true;
  },
};

// Medical Record functions
export const medicalRecordStorage = {
  getAll: (): MedicalRecord[] => getFromStorage<MedicalRecord>(STORAGE_KEYS.MEDICAL_RECORDS),
  
  getById: (id: string): MedicalRecord | undefined => {
    const records = getFromStorage<MedicalRecord>(STORAGE_KEYS.MEDICAL_RECORDS);
    return records.find(record => record.id === id);
  },
  
  getByPatientId: (patientId: string): MedicalRecord[] => {
    const records = getFromStorage<MedicalRecord>(STORAGE_KEYS.MEDICAL_RECORDS);
    return records.filter(record => record.patientId === patientId);
  },
  
  create: (record: Omit<MedicalRecord, 'id' | 'createdAt'>): MedicalRecord => {
    const records = getFromStorage<MedicalRecord>(STORAGE_KEYS.MEDICAL_RECORDS);
    const newRecord: MedicalRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    records.push(newRecord);
    saveToStorage(STORAGE_KEYS.MEDICAL_RECORDS, records);
    return newRecord;
  },
  
  delete: (id: string): boolean => {
    const records = getFromStorage<MedicalRecord>(STORAGE_KEYS.MEDICAL_RECORDS);
    const filtered = records.filter(record => record.id !== id);
    if (filtered.length === records.length) return false;
    saveToStorage(STORAGE_KEYS.MEDICAL_RECORDS, filtered);
    return true;
  },
};