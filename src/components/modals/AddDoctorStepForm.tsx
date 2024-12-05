import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';
import { FileUpload } from '../common/FileUpload';
import { uploadMultipleFileTypes } from '../../utils/fileUpload';

interface AddDoctorStepFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const initialFormData = {
  name: '',
  registrationNumber: '',
  clinicName: '',
  degree: '',
  aadharNumber: '',
  mobileNumber: '',
  email: '',
  status: 'pending',
  files: {},
  clinics: [{ name: '', address: '', latitude: '', longitude: '' }]
};

export const AddDoctorStepForm = ({ isOpen, onClose, onSuccess }: AddDoctorStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (files: File[], field: string) => {
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [field]: files
      }
    }));
  };

  const handleClinicChange = (index: number, field: string, value: string) => {
    const newClinics = [...formData.clinics];
    newClinics[index] = { ...newClinics[index], [field]: value };
    setFormData(prev => ({ ...prev, clinics: newClinics }));
  };

  const addClinic = () => {
    setFormData(prev => ({
      ...prev,
      clinics: [...prev.clinics, { name: '', address: '', latitude: '', longitude: '' }]
    }));
  };

  const removeClinic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      clinics: prev.clinics.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let fileUrls = {};

      // Only attempt file upload if there are files
      if (Object.keys(formData.files).length > 0) {
        fileUrls = await uploadMultipleFileTypes(
          formData.files,
          `doctors/${formData.registrationNumber}`
        );
      }

      // Create doctor document
      const doctorData = {
        name: formData.name,
        registrationNumber: formData.registrationNumber,
        clinicName: formData.clinicName,
        degree: formData.degree,
        aadharNumber: formData.aadharNumber,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        status: formData.status,
        clinics: formData.clinics,
        fileUrls,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'doctors'), doctorData);
      toast.success('Doctor added successfully!');
      setFormData(initialFormData);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast.error('Failed to add doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Registration Number</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.registrationNumber}
            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Doctor's Clinic Name</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.clinicName}
            onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Degree</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.aadharNumber}
            onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="tel"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.mobileNumber}
            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-4">
      <FileUpload
        label="10th Grade Marksheet"
        onChange={(files) => handleFileChange(files, 'tenthMarksheet')}
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <FileUpload
        label="12th Grade Marksheet"
        onChange={(files) => handleFileChange(files, 'twelfthMarksheet')}
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <FileUpload
        label="Medical Degree Certificate"
        onChange={(files) => handleFileChange(files, 'degreeCertificate')}
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <FileUpload
        label="Doctor Photograph"
        onChange={(files) => handleFileChange(files, 'photograph')}
        accept="image/*"
      />

      <FileUpload
        label="MCI Registration"
        onChange={(files) => handleFileChange(files, 'mciRegistration')}
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );

  const renderClinicDetails = () => (
    <div className="space-y-6">
      {formData.clinics.map((clinic, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Clinic {index + 1}</h3>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeClinic(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={clinic.name}
                onChange={(e) => handleClinicChange(index, 'name', e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={clinic.address}
                onChange={(e) => handleClinicChange(index, 'address', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={clinic.latitude}
                onChange={(e) => handleClinicChange(index, 'latitude', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={clinic.longitude}
                onChange={(e) => handleClinicChange(index, 'longitude', e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <FileUpload
                label="Clinic Photos"
                onChange={(files) => handleFileChange(files, `clinicPhotos_${index}`)}
                accept="image/*"
                multiple
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addClinic}
        className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Add Another Clinic
      </button>
    </div>
  );

  const steps = [
    { title: 'Personal Information', content: renderPersonalInfo },
    { title: 'Documents', content: renderDocuments },
    { title: 'Clinic Details', content: renderClinicDetails }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Doctor" maxWidth="max-w-4xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > index
                    ? 'bg-green-500 text-white'
                    : currentStep === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <div
                className={`ml-2 text-sm ${
                  currentStep === index + 1 ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}
              >
                {step.title}
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 border-t border-gray-200 mx-4 mt-4" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          {steps[currentStep - 1].content()}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setCurrentStep(prev => prev - 1)}
          className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            currentStep === 1 ? 'invisible' : ''
          }`}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            if (currentStep === steps.length) {
              handleSubmit();
            } else {
              setCurrentStep(prev => prev + 1);
            }
          }}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : currentStep === steps.length ? 'Submit' : 'Next'}
        </button>
      </div>
    </Modal>
  );
};