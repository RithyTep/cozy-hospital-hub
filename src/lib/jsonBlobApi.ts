import { Patient, Doctor, Appointment, MedicalRecord } from '@/types/hms';

interface AdminAuth {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

interface AdminSession {
  id: string;
  username: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

const API_BASE = 'https://jsonblob.com/api/jsonBlob';

// Storage for blob IDs - in production, these would be stored in a more persistent way
const BLOB_IDS = {
  PATIENTS: localStorage.getItem('patients_blob_id') || '',
  DOCTORS: localStorage.getItem('doctors_blob_id') || '',
  APPOINTMENTS: localStorage.getItem('appointments_blob_id') || '',
  MEDICAL_RECORDS: localStorage.getItem('medical_records_blob_id') || '',
  ADMIN_AUTH: localStorage.getItem('admin_auth_blob_id') || '',
};

// Initialize blob IDs if they don't exist
const initializeBlobIds = async () => {
  const keys = Object.keys(BLOB_IDS) as Array<keyof typeof BLOB_IDS>;
  
  for (const key of keys) {
    if (!BLOB_IDS[key]) {
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([]),
        });
        
        if (response.ok) {
          const url = response.headers.get('Location');
          if (url) {
            const blobId = url.split('/').pop();
            if (blobId) {
              BLOB_IDS[key] = blobId;
              localStorage.setItem(`${key.toLowerCase()}_blob_id`, blobId);
            }
          }
        }
      } catch (error) {
        console.error(`Failed to initialize blob for ${key}:`, error);
      }
    }
  }
};

// Generic API functions
async function getFromApi<T>(blobId: string): Promise<T[]> {
  if (!blobId) return [];
  
  try {
    const response = await fetch(`${API_BASE}/${blobId}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching from API:', error);
  }
  return [];
}

async function saveToApi<T>(blobId: string, data: T[]): Promise<boolean> {
  if (!blobId) return false;
  
  try {
    const response = await fetch(`${API_BASE}/${blobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving to API:', error);
    return false;
  }
}

// Initialize on module load
initializeBlobIds();

// Patient functions
export const patientApi = {
  getAll: (): Promise<Patient[]> => getFromApi<Patient>(BLOB_IDS.PATIENTS),
  
  getById: async (id: string): Promise<Patient | undefined> => {
    const patients = await getFromApi<Patient>(BLOB_IDS.PATIENTS);
    return patients.find(patient => patient.id === id);
  },
  
  create: async (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient | null> => {
    const patients = await getFromApi<Patient>(BLOB_IDS.PATIENTS);
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    patients.push(newPatient);
    const success = await saveToApi(BLOB_IDS.PATIENTS, patients);
    return success ? newPatient : null;
  },
  
  update: async (id: string, updates: Partial<Patient>): Promise<Patient | null> => {
    const patients = await getFromApi<Patient>(BLOB_IDS.PATIENTS);
    const index = patients.findIndex(patient => patient.id === id);
    if (index === -1) return null;
    
    patients[index] = {
      ...patients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const success = await saveToApi(BLOB_IDS.PATIENTS, patients);
    return success ? patients[index] : null;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const patients = await getFromApi<Patient>(BLOB_IDS.PATIENTS);
    const filtered = patients.filter(patient => patient.id !== id);
    if (filtered.length === patients.length) return false;
    return await saveToApi(BLOB_IDS.PATIENTS, filtered);
  },
};

// Doctor functions
export const doctorApi = {
  getAll: (): Promise<Doctor[]> => getFromApi<Doctor>(BLOB_IDS.DOCTORS),
  
  getById: async (id: string): Promise<Doctor | undefined> => {
    const doctors = await getFromApi<Doctor>(BLOB_IDS.DOCTORS);
    return doctors.find(doctor => doctor.id === id);
  },
  
  create: async (doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Doctor | null> => {
    const doctors = await getFromApi<Doctor>(BLOB_IDS.DOCTORS);
    const newDoctor: Doctor = {
      ...doctor,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    doctors.push(newDoctor);
    const success = await saveToApi(BLOB_IDS.DOCTORS, doctors);
    return success ? newDoctor : null;
  },
  
  update: async (id: string, updates: Partial<Doctor>): Promise<Doctor | null> => {
    const doctors = await getFromApi<Doctor>(BLOB_IDS.DOCTORS);
    const index = doctors.findIndex(doctor => doctor.id === id);
    if (index === -1) return null;
    
    doctors[index] = {
      ...doctors[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const success = await saveToApi(BLOB_IDS.DOCTORS, doctors);
    return success ? doctors[index] : null;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const doctors = await getFromApi<Doctor>(BLOB_IDS.DOCTORS);
    const filtered = doctors.filter(doctor => doctor.id !== id);
    if (filtered.length === doctors.length) return false;
    return await saveToApi(BLOB_IDS.DOCTORS, filtered);
  },
};

// Appointment functions
export const appointmentApi = {
  getAll: (): Promise<Appointment[]> => getFromApi<Appointment>(BLOB_IDS.APPOINTMENTS),
  
  getById: async (id: string): Promise<Appointment | undefined> => {
    const appointments = await getFromApi<Appointment>(BLOB_IDS.APPOINTMENTS);
    return appointments.find(appointment => appointment.id === id);
  },
  
  getByPatientId: async (patientId: string): Promise<Appointment[]> => {
    const appointments = await getFromApi<Appointment>(BLOB_IDS.APPOINTMENTS);
    return appointments.filter(appointment => appointment.patientId === patientId);
  },
  
  getByDoctorId: async (doctorId: string): Promise<Appointment[]> => {
    const appointments = await getFromApi<Appointment>(BLOB_IDS.APPOINTMENTS);
    return appointments.filter(appointment => appointment.doctorId === doctorId);
  },
  
  create: async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment | null> => {
    const appointments = await getFromApi<Appointment>(BLOB_IDS.APPOINTMENTS);
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    appointments.push(newAppointment);
    const success = await saveToApi(BLOB_IDS.APPOINTMENTS, appointments);
    return success ? newAppointment : null;
  },
  
  update: async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
    const appointments = await getFromApi<Appointment>(BLOB_IDS.APPOINTMENTS);
    const index = appointments.findIndex(appointment => appointment.id === id);
    if (index === -1) return null;
    
    appointments[index] = {
      ...appointments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const success = await saveToApi(BLOB_IDS.APPOINTMENTS, appointments);
    return success ? appointments[index] : null;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const appointments = await getFromApi<Appointment>(BLOB_IDS.APPOINTMENTS);
    const filtered = appointments.filter(appointment => appointment.id !== id);
    if (filtered.length === appointments.length) return false;
    return await saveToApi(BLOB_IDS.APPOINTMENTS, filtered);
  },
};

// Medical Record functions
export const medicalRecordApi = {
  getAll: (): Promise<MedicalRecord[]> => getFromApi<MedicalRecord>(BLOB_IDS.MEDICAL_RECORDS),
  
  getById: async (id: string): Promise<MedicalRecord | undefined> => {
    const records = await getFromApi<MedicalRecord>(BLOB_IDS.MEDICAL_RECORDS);
    return records.find(record => record.id === id);
  },
  
  getByPatientId: async (patientId: string): Promise<MedicalRecord[]> => {
    const records = await getFromApi<MedicalRecord>(BLOB_IDS.MEDICAL_RECORDS);
    return records.filter(record => record.patientId === patientId);
  },
  
  create: async (record: Omit<MedicalRecord, 'id' | 'createdAt'>): Promise<MedicalRecord | null> => {
    const records = await getFromApi<MedicalRecord>(BLOB_IDS.MEDICAL_RECORDS);
    const newRecord: MedicalRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    records.push(newRecord);
    const success = await saveToApi(BLOB_IDS.MEDICAL_RECORDS, records);
    return success ? newRecord : null;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const records = await getFromApi<MedicalRecord>(BLOB_IDS.MEDICAL_RECORDS);
    const filtered = records.filter(record => record.id !== id);
    if (filtered.length === records.length) return false;
    return await saveToApi(BLOB_IDS.MEDICAL_RECORDS, filtered);
  },
};

// Admin Authentication functions
export const adminAuthApi = {
  // Initialize default admin if not exists
  initialize: async (): Promise<void> => {
    const auths = await getFromApi<AdminAuth>(BLOB_IDS.ADMIN_AUTH);
    if (auths.length === 0) {
      const defaultAdmin: AdminAuth = {
        id: 'admin_1',
        username: 'AdminRith',
        password: '5569',
        createdAt: new Date().toISOString(),
      };
      await saveToApi(BLOB_IDS.ADMIN_AUTH, [defaultAdmin]);
    }
  },

  // Login function
  login: async (username: string, password: string): Promise<string | null> => {
    await adminAuthApi.initialize();
    const auths = await getFromApi<AdminAuth>(BLOB_IDS.ADMIN_AUTH);
    const admin = auths.find(auth => auth.username === username && auth.password === password);
    
    if (admin) {
      // Create session token
      const token = `hms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry
      
      const session: AdminSession = {
        id: Date.now().toString(),
        username: admin.username,
        token,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Store session in localStorage for quick access
      localStorage.setItem('admin_session', JSON.stringify(session));
      return token;
    }
    return null;
  },

  // Validate session
  validateSession: async (): Promise<boolean> => {
    const sessionStr = localStorage.getItem('admin_session');
    if (!sessionStr) return false;
    
    try {
      const session: AdminSession = JSON.parse(sessionStr);
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);
      
      return now < expiresAt;
    } catch {
      return false;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    localStorage.removeItem('admin_session');
  },

  // Get current session
  getCurrentSession: (): AdminSession | null => {
    const sessionStr = localStorage.getItem('admin_session');
    if (!sessionStr) return null;
    
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  },
};