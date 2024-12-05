import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import toast from 'react-hot-toast';
import { FileUpload } from '../common/FileUpload';
import { Doctor } from '../../types/doctor';

interface EditDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
}

export const EditDoctorModal = ({ isOpen, onClose, doctor }: EditDoctorModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    ...doctor,
    clinics: doctor.clinics || []
  });
  const [newFiles, setNewFiles] = useState<{
    [key: string]: File[];
  }>({});
  const [loading, setLoading] = useState(false);

  const handleFileChange = (files: File[], field: string) => {
    setNewFiles(prev => ({
      ...prev,
      [field]: files
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

  const uploadNewFiles = async () => {
    const uploadedUrls: Record<string, string[]> = {};

    for (const [key, files] of Object.entries(newFiles)) {
      if (files && files.length > 0) {
        const urls = await Promise.all(
          files.map(async (file) => {
            const storageRef = ref(storage, `doctors/${formData.registrationNumber}/${key}/${file.name}`);
            await uploadBytes(storageRef, file);
            return getDownloadURL(storageRef);
          })
        );
        uploadedUrls[key] = urls;
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const newFileUrls = await uploadNewFiles();
      
      const updatedFileUrls = { ...formData.fileUrls };
      for (const [key, urls] of Object.entries(newFileUrls)) {
        updatedFileUrls[key] = [
          ...(updatedFileUrls[key] || []),
          ...urls
        ];
      }

      const docRef = doc(db, 'doctors', doctor.id);
      await updateDoc(docRef, {
        ...formData,
        fileUrls: updatedFileUrls,
        updatedAt: new Date().toISOString()
      });

      toast.success('Doctor updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast.error('Failed to update doctor');
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
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
        existingFiles={formData.fileUrls?.tenthMarksheet || []}
        onRemove={(index) => {
          const newUrls = { ...formData.fileUrls };
          newUrls.tenthMarksheet = newUrls.tenthMarksheet?.filter((_, i) => i !== index);
          setFormData({ ...formData, fileUrls: newUrls });
        }}
      />

      <FileUpload
        label="12th Grade Marksheet"
        onChange={(files) => handleFileChange(files, 'twelfthMarksheet')}
        accept=".pdf,.jpg,.jpeg,.png"
        existingFiles={formData.fileUrls?.twelfthMarksheet || []}
        onRemove={(index) => {
          const newUrls = { ...formData.fileUrls };
          newUrls.twelfthMarksheet = newUrls.twelfthMarksheet?.filter((_, i) => i !== index);
          setFormData({ ...formData, fileUrls: newUrls });
        }}
      />

      <FileUpload
        label="Medical Degree Certificate"
        onChange={(files) => handleFileChange(files, 'degreeCertificate')}
        accept=".pdf,.jpg,.jpeg,.png"
        existingFiles={formData.fileUrls?.degreeCertificate || []}
        onRemove={(index) => {
          const newUrls = { ...formData.fileUrls };
          newUrls.degreeCertificate = newUrls.degreeCertificate?.filter((_, i) => i !== index);
          setFormData({ ...formData, fileUrls: newUrls });
        }}
      />

      <FileUpload
        label="Doctor Photograph"
        onChange={(files) => handleFileChange(files, 'photograph')}
        accept="image/*"
        existingFiles={formData.fileUrls?.photograph || []}
        onRemove={(index) => {
          const newUrls = { ...formData.fileUrls };
          newUrls.photograph = newUrls.photograph?.filter((_, i) => i !== index);
          setFormData({ ...formData, fileUrls: newUrls });
        }}
      />

      <FileUpload
        label="MCI Registration"
        onChange={(files) => handleFileChange(files, 'mciRegistration')}
        accept=".pdf,.jpg,.jpeg,.png"
        existingFiles={formData.fileUrls?.mciRegistration || []}
        onRemove={(index) => {
          const newUrls = { ...formData.fileUrls };
          newUrls.mciRegistration = newUrls.mciRegistration?.filter((_, i) => i !== index);
          setFormData({ ...formData, fileUrls: newUrls });
        }}
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
                existingFiles={formData.fileUrls?.clinicPhotos || []}
                onRemove={(photoIndex) => {
                  const newUrls = { ...formData.fileUrls };
                  newUrls.clinicPhotos = newUrls.clinicPhotos?.filter((_, i) => i !== photoIndex);
                  setFormData({ ...formData, fileUrls: newUrls });
                }}
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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Doctor" maxWidth="max-w-4xl">
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
          {loading ? 'Processing...' : currentStep === steps.length ? 'Update' : 'Next'}
        </button>
      </div>
    </Modal>
  );
};