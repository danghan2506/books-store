import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/admin-sidebar';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import type React from 'react';
const AdminLayout = () => {
  return (
     <SidebarProvider>
      <AdminSidebar/>
      <main>
        <SidebarTrigger/>
        <Outlet /> 
      </main>
      
    </SidebarProvider>
  )
}

export default AdminLayout