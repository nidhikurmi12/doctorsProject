import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface AddHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddHospitalModal = ({ isOpen, onClose }: AddHospitalModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    cmoNumber: '',
    insuranceProviders: [] as string[],
    ayushmanBharat: false,
    cghs: false,
    ownershipType: '',
    charges: [{ name: '', timing: '', price: '' }],
    doctorsCount: {
      available: 0,
      onCall: 0,
      permanent: 0
    },
    facilities: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'hospitals'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      toast.success('Hospital added successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to add hospital');
    }
  };

  const addCharge = () => {
    setFormData({
      ...formData,
      charges: [...formData.charges, { name: '', timing: '', price: '' }]
    });
  };

  const updateCharge = (index: number, field: string, value: string) => {
    const newCharges = [...formData.charges];
    newCharges[index] = { ...newCharges[index], [field]: value };
    setFormData({ ...formData, charges: newCharges });
  };

  const removeCharge = (index: number) => {
    setFormData({
      ...formData,
      charges: formData.charges.filter((_, i) => i !== index)
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Hospital">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CMO Number</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.cmoNumber}
              onChange={(e) => setFormData({ ...formData, cmoNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ownership Type</label>
            <select
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.ownershipType}
              onChange={(e) => setFormData({ ...formData, ownershipType: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="Trust">Trust</option>
              <option value="Society">Society</option>
              <option value="Individual">Individual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance Providers</label>
            <select
              multiple
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.insuranceProviders}
              onChange={(e) => setFormData({
                ...formData,
                insuranceProviders: Array.from(e.target.selectedOptions, option => option.value)
              })}
            >
              <option value="Max">Max</option>
              <option value="HDFC Ergo">HDFC Ergo</option>
              <option value="Star Health">Star Health</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Charges</label>
            {formData.charges.map((charge, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  value={charge.name}
                  onChange={(e) => updateCharge(index, 'name', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Timing"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  value={charge.timing}
                  onChange={(e) => updateCharge(index, 'timing', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Price"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  value={charge.price}
                  onChange={(e) => updateCharge(index, 'price', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeCharge(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCharge}
              className="mt-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              + Add Charge
            </button>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Doctor Availability</label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <input
                  type="number"
                  placeholder="Available"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.doctorsCount.available}
                  onChange={(e) => setFormData({
                    ...formData,
                    doctorsCount: { ...formData.doctorsCount, available: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="On Call"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.doctorsCount.onCall}
                  onChange={(e) => setFormData({
                    ...formData,
                    doctorsCount: { ...formData.doctorsCount, onCall: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Permanent"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.doctorsCount.permanent}
                  onChange={(e) => setFormData({
                    ...formData,
                    doctorsCount: { ...formData.doctorsCount, permanent: parseInt(e.target.value) }
                  })}
                />
              </div>
            </div>
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
            Add Hospital
          </button>
        </div>
      </form>
    </Modal>
  );
};