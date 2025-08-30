import { Link } from "react-router";
import logo from "../assets/logo.png";
import { CgMenuLeft } from "react-icons/cg";
import Navbar from "./navbar";
import { ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { RootState } from "@/redux/features/store";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/redux/API/user-api-slice";
import { logout } from "@/redux/features/auth/auth-slice";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuOpenned, setMenuOpenned] = useState(false);
  const [active, setActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoutApiCall] = useLogoutMutation()
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const toggleMenu = () => {
    setMenuOpenned((prev) => !prev);
  };
  const logoutHandler = async() => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }
  const truncateUsername = (username: string, maxLength: number) => {
    return username.length > maxLength 
      ? `${username.substring(0, maxLength)}...` 
      : username;
  };
  const getUserInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  useEffect(() => {
    const handleScroll = () => {
      setActive(true)
      setIsScrolled(window.scrollY > 20);
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled, isMobileMenuOpen]);
  return (
   <header className="fixed top-0 w-full left-0 right-0 z-50 bg-white shadow-sm">
      <div
        className={`${
          active ? "bg-white py-2.5" : "bg-zinc-50 py-3"
        } py-3 mx-auto max-w-[1440px] px-6 lg:px-12 flex items-center justify-between`}
      >
        {/* Left side - Logo */}
        <Link
          to={"/"}
          className="flex items-center justify-start min-w-0 flex-1"
        >
          <img
            src={logo}
            height={36}
            width={36}
            className="hidden sm:flex mr-2"
            alt="Book Store Logo"
          ></img>
          <h4 className="font-bold text-xl text-gray-800">BookHub</h4>
        </Link>
        {/* Center - Navigation */}
        <div className="flex-1 flex justify-center">
          <Navbar
            menuOpenned={menuOpenned}
            toggleMenu={toggleMenu}
            containerStyles={`${
              menuOpenned
                ? "flex flex-col gap-y-16 h-screen w-[222px] absolute left-0 top-0 bg-white z-50 px-10 py-4 shadow-xl"
                : "hidden xl:flex justify-center gap-x-8 xl:gap-x-14 text-[15px] font-[500] rounded-full px-2 py-1"
            }`}
          />
        </div>

        {/* Right side - Menu, Cart, Login */}
        <div className="flex items-center justify-end gap-x-4 sm:gap-x-6 flex-1">
          <CgMenuLeft
            onClick={toggleMenu}
            className="text-2xl xl:hidden cursor-pointer hover:text-red-500 transition-colors"
          />

          {/* Shopping Cart */}
          <Link to={"/cart"} className="flex relative group">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-md group-hover:shadow-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -top-2 -right-2 bg-neutral-200 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white min-w-[24px]">
            
            {cartItems.length}
            </span>
          </Link>

          {/* Login Button */}
          <div className="relative group">
            {userInfo && (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="user bg-user border-user-border hover:bg-user-hover transition-smooth focus:ring-2 focus:ring-primary/20"
                  >
                    {/* Mobile: Show only initials */}
                    <div className="sm:hidden w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {getUserInitials(userInfo.username)}
                    </div>
                    
                    {/* Tablet: Show truncated username */}
                    <div className="hidden sm:flex md:hidden items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">
                        {truncateUsername(userInfo.username, 8)}
                      </span>
                    </div>
                    
                    {/* Desktop: Show full username (with max width) */}
                    <div className="hidden md:flex items-center space-x-2 max-w-[200px]">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        Hi, {userInfo.username}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-popover border shadow-elegant"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{userInfo.username}</p>
                    <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Link to ="/my-orders">
                    <span> My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link to ="/my-profile">
                    <span> My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={logoutHandler}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
