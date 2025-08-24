import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/admin-sidebar';
import { SidebarProvider} from './components/ui/sidebar';
const AdminLayout = () => {
  return (
     <SidebarProvider>
      <AdminSidebar/>
      <main>
        <Outlet /> 
      </main>
      
    </SidebarProvider>
  )
}

export default AdminLayout