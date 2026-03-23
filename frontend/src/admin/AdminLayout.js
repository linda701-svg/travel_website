import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../Style/AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main-content">
        <AdminHeader />

        <main className="admin-content">
          <Outlet />   {/* 👈 THIS FIXES EVERYTHING */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
