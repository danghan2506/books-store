import {ChevronsUpDown,User2,Settings,LayoutDashboard,BookA,Users
} from "lucide-react";
import {Sidebar,SidebarContent,SidebarGroup,SidebarGroupContent,SidebarGroupLabel,SidebarMenu,SidebarMenuButton,SidebarMenuItem,SidebarFooter,
} from "@/components/ui/sidebar";
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/redux/API/user-api-slice";
import { logout } from "@/redux/features/auth/auth-slice";
import type { RootState } from "@/redux/features/store";
const AdminSidebar = () => {
  const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/admin/books-list",
    icon: BookA,
  },
  {
    title: "Users",
    url: "users-list",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/my-profile",
    icon: Settings,
  }
];
const { userInfo } = useSelector((state: RootState) => state.auth);  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation()
  const handleLogout = async () => {
    try {
        await logoutApi().unwrap()
        dispatch(logout())
        navigate("/login")
    } catch (error) {
        console.error(error)
    }
  }
  return (
     <Sidebar className="z-10">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>HT Shop</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon size={36} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />{" "}
                  {userInfo ? (
                    <span className="text-neutral-600">
                      {userInfo.username}
                    </span>
                  ) : (
                    <span>Username</span>
                  )}
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {!userInfo ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">
                        <span>Login</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/signup">
                        <span>Register</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    {userInfo.role === "admin" && (
                      <> 
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/users-list">
                          <span>Users</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                      <Link to="/admin/create-books">
                        <span>Create books</span>
                      </Link>
                    </DropdownMenuItem>
                      </>
                      
                    )}
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/my-profile">
                       <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
export default AdminSidebar