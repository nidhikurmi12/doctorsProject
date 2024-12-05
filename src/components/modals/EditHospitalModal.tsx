import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface Hospital {
  id: string;
  name: string;
  type: string;
  beds: string;
  address: string;
  phone: string;
  email: string;
}

interface EditHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospital: Hospital;
}

export const EditHospitalModal = ({ isOpen, onClose, hospital }: EditHospitalModalProps) => {
  const [formData, setFormData] = useState(hospital);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const docRef = doc(db, 'hospitals', hospital.id);
      await updateDoc(docRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      toast.success('Hospital updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update hospital');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Hospital">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="General">General</option>
              <option value="Specialty">Specialty</option>
              <option value="Multi-Specialty">Multi-Specialty</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Beds</label>
            <input
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.beds}
              onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Hospital'}
          </button>
        </div>
      </form>
    </Modal>
  );
};