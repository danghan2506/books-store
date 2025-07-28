import { CircleX, Heart, Home, Library} from 'lucide-react'
import { NavLink } from 'react-router'
import { Link } from 'react-router-dom'
const Navbar = ({containerStyles, toggleMenu, menuOpenned}) => {
  const navItems = [
    {to: '/', label: "Home", icon: <Home/>},
    {to: '/shop' , label: "Shop", icon: <Library/>},
    {to: '/favourite', label: 'Favourite', icon: <Heart/>}
  ]  
  return (
    <nav className={containerStyles}>
        {menuOpenned && (
          <>
            <CircleX onClick={toggleMenu} className='text-xl self-end cursor-pointer relative left-8'/>
            <Link to={'/'} className='font-bold mb-10'>
              <h4 className='text-gray-800'>Book Store</h4>
            </Link>
          </>
        )}
        {navItems.map(({to, label, icon}) => (
            <div key={label} className='inline-flex relative top-1'>
                <NavLink to={to} className={({isActive}) => isActive ? "text-blue-500 relative after:w-2/3 after:h-[2px] after:rounded-full after:bg-secondary after:absolute after:-bottom-2 after:left-0 flex items-center justify-center gap-x-2" : "flex items-center justify-center gap-x-2"}>
                    <span className='text-xl'>{icon}</span>
                    <span className='text-[16px] font-[500];'>{label}</span>
                </NavLink>
            </div>
        ))}
    </nav>
  )
}

export default Navbar