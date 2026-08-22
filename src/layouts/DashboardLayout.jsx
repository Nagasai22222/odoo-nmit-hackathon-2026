import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto">
        <div className="animate-in fade-in duration-300 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
