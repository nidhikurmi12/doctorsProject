export interface DoctorFormData {
  name: string;
  registrationNumber: string;
  clinicName: string;
  degree: string;
  aadharNumber: string;
  mobileNumber: string;
  email: string;
  status: string;
  files: {
    [key: string]: File[];
  };
  fileUrls?: {
    [key: string]: string[];
  };
  clinics: Array<{
    name: string;
    address: string;
    latitude: string;
    longitude: string;
  }>;
}

export interface Doctor extends Omit<DoctorFormData, 'files'> {
  id: string;
  createdAt: string;
  updatedAt?: string;
}