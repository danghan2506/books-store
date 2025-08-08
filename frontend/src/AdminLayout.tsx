import { Outlet } from 'react-router-dom';
const AdminLayout = () => {
  return (
     <div>
      {/* Navbar hoặc sidebar admin chung */}
      <nav>Admin Navigation</nav>
      <main>
        <Outlet /> {/* Nội dung của route con sẽ render ở đây */}
      </main>
    </div>
  )
}

export default AdminLayout