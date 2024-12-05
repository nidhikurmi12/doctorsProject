import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDoctorModal = ({ isOpen, onClose }: AddDoctorModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    clinicName: '',
    clinicAddress: '',
    latitude: '',
    longitude: '',
    aadharNumber: '',
    mobileNumber: '',
    email: '',
    specialization: '',
    qualifications: '',
    experience: '',
    status: 'pending'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'doctors'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      toast.success('Doctor added successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to add doctor');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Doctor">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Number</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Clinic Details</label>
            <input
              type="text"
              placeholder="Clinic Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.clinicName}
              onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Clinic Address"
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.clinicAddress}
              onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                type="text"
                placeholder="Latitude"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              />
              <input
                type="text"
                placeholder="Longitude"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.aadharNumber}
              onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="tel"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Qualifications</label>
            <textarea
              required
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.qualifications}
              onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              placeholder="Enter educational qualifications"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </Modal>
  );
};