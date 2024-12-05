
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { DashboardHome } from '../components/dashboard/DashboardHome';
import { DoctorsList } from '../components/dashboard/DoctorsList';
import { HospitalsList } from '../components/dashboard/HospitalsList';
import { UsersList } from '../components/dashboard/UsersList';

export const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/hospitals" element={<HospitalsList />} />
            <Route path="/users" element={<UsersList />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};