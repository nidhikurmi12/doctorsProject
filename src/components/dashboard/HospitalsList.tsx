import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Trash2, Edit, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { AddHospitalModal } from '../modals/AddHospitalModal';
import { EditHospitalModal } from '../modals/EditHospitalModal';
import { DeleteConfirmation } from '../common/DeleteConfirmation';

interface Hospital {
  id: string;
  name: string;
  type: string;
  beds: string;
  address: string;
  phone: string;
  email: string;
}

export const HospitalsList = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'hospitals'));
      const hospitalsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Hospital));
      setHospitals(hospitalsData);
    } catch (error) {
      toast.error('Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsEditModalOpen(true);
  };

  const handleDelete = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedHospital) return;
    
    try {
      await deleteDoc(doc(db, 'hospitals', selectedHospital.id));
      setHospitals(hospitals.filter(h => h.id !== selectedHospital.id));
      toast.success('Hospital deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete hospital');
    }
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const searchLower = searchTerm.toLowerCase();
    return (
      hospital.name?.toLowerCase().includes(searchLower) ||
      hospital.type?.toLowerCase().includes(searchLower) ||
      hospital.address?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-gray-600">Loading hospitals...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search hospitals..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Hospital
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beds</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredHospitals.map((hospital) => (
              <tr key={hospital.id}>
                <td className="px-6 py-4 whitespace-nowrap">{hospital.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    hospital.type === 'General' ? 'bg-green-100 text-green-800' :
                    hospital.type === 'Specialty' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {hospital.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{hospital.beds}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div>{hospital.email}</div>
                    <div className="text-sm text-gray-500">{hospital.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{hospital.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(hospital)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(hospital)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddHospitalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedHospital && (
        <EditHospitalModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedHospital(null);
          }}
          hospital={selectedHospital}
        />
      )}

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Hospital"
        message="Are you sure you want to delete this hospital? This action cannot be undone."
      />
    </div>
  );
};