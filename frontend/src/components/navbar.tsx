import { CircleX, Heart, Home, Library} from 'lucide-react'
import { NavLink, useLocation, Link } from 'react-router-dom'

import { motion } from 'framer-motion'
interface NavbarProps {
  containerStyles?: string
  toggleMenu?: () => void
  menuOpenned?: boolean
}
const Navbar = ({containerStyles, toggleMenu, menuOpenned}: NavbarProps) => {
  const location = useLocation()
  const navItems = [
    {to: '/', label: "Home", icon: <Home/>},
    {to: '/shop' , label: "Shop", icon: <Library/>},
    {to: '/favourite', label: 'Favourite', icon: <Heart/>}
  ]
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }
  return (
    <nav className={containerStyles}>
        {menuOpenned && (
          <>
            <CircleX onClick={toggleMenu} className='text-xl self-end cursor-pointer relative left-8'/>
            <Link to={'/'} className='font-bold mb-10'>
              <h4 className='text-gray-800'>BookHub</h4>
            </Link>
          </>
        )}
        
        {navItems.map(({to, label, icon}) => (
            <div key={label} className='inline-flex relative'>
                <NavLink 
                  to={to} 
                  className={`flex items-center justify-center gap-x-2 relative px-4 py-2 transition-colors duration-200 ${
                    isActive(to) ? 'text-blue-500' : 'text-gray-700 hover:text-blue-400'
                  }`}
                >
                    <span className='text-xl'>{icon}</span>
                    <span className='text-[16px] font-[500]'>{label}</span>
                    
                    {/* Animated indicator - tương tự như tab component */}
                    {isActive(to) && (
                      <motion.div 
                        layoutId='navbar-indicator'
                        className='absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-500 rounded-full'
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                </NavLink>
            </div>
        ))}
    </nav>
  )
}

export default Navbar