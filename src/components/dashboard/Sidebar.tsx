import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Stethoscope, Building2, ChevronRight, Menu, ChevronLeft } from 'lucide-react';

const menuItems = [
  {
    icon: Stethoscope,
    label: 'Doctors',
    path: '/dashboard/doctors'
  },
  {
    icon: Building2,
    label: 'Hospitals',
    path: '/dashboard/hospitals'
  },
  {
    icon: Users,
    label: 'Users',
    path: '/dashboard/users'
  }
];

export const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className={`${
        isOpen ? 'translate-x-0' : '-translate-x-64'
      } fixed lg:static inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex flex-col h-full bg-gray-800 text-white">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Healthcare</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="py-4">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm ${
                      location.pathname === item.path
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Toggle button for mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className={`${
          isOpen ? 'hidden' : 'block'
        } fixed top-4 left-4 z-50 lg:hidden bg-gray-800 text-white p-2 rounded-md`}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};