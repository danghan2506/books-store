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
const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuOpenned, setMenuOpenned] = useState(false);
  const [active, setActive] = useState(false);
  const [logoutApiCall] = useLogoutMutation()
  const { userInfo } = useSelector((state: RootState) => state.auth);
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
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        // close menu it opnened when scrolling occured
        if (menuOpenned) {
          setMenuOpenned(false);
        }
      }
      setActive(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    // clean up the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpenned]);
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
          <h4 className="font-bold text-xl text-gray-800">Book Store</h4>
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
            className="text-2xl xl:hidden cursor-pointer hover:text-blue-500 transition-colors"
          />

          {/* Shopping Cart */}
          <Link to={"/cart"} className="flex relative group">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-200 shadow-md group-hover:shadow-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white min-w-[24px]">
              2
            </span>
          </Link>

          {/* Login Button */}
          <div className="relative group">
            {userInfo ? (
              <button className="text-sm font-medium bg-white border border-gray-200 px-6 py-2.5 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-x-2 shadow-sm hover:shadow-md cursor-pointer">
                Hi, {userInfo.username}
              </button>
            ) : (
              <Link to="/login">
                <button className="text-sm font-medium bg-white border border-gray-200 px-6 py-2.5 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-x-2 shadow-sm hover:shadow-md cursor-pointer">
                  Login <User className="w-4 h-4" />
                </button>
              </Link>
            )}
            {userInfo && (
              <>
                <ul className="bg-white p-1 w-32 ring-1 ring-slate-900/5 rounded absolute right-0 top-10 hidden group-hover:flex flex-col text-[14px] font-[400] shadow-md">
                  <li className="p-2 text-gray-300 rounded-md hover:bg-neutral-100 cursor-pointer">
                    Orders
                  </li>
                  <li
                    onClick={logoutHandler}
                    className="p-2 text-gray-300 rounded-md hover:bg-neutral-100 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
