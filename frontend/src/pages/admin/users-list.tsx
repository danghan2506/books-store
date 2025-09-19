
import {Trash2, Edit, Check, X, Mail, Users, Shield} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton"
import {toast} from "sonner"
import { Input } from '@/components/ui/input';
import { useDeleteUserMutation, useUpdateUserProfileMutation, useGetAllUsersQuery } from "@/redux/API/user-api-slice";
import { useEffect, useState } from "react";
const UsersList = () => {
    const {data: users, refetch, isLoading, error} = useGetAllUsersQuery()
    const [deleteUser] = useDeleteUserMutation()
    const [editableUserId, setEditableUserId] = useState("")
    const [editableUserName, setEditableUserName] = useState("");
    const [updateUser] = useUpdateUserProfileMutation()
    useEffect(() => {
    refetch();
  }, [refetch]);
  const deleteHandler = async (id : string) => {
    if(window.confirm("Are you sure want to delete this user?")) {
      try {
        await deleteUser(id)
        refetch()
      } catch (err: unknown) {
      console.error(err)
            let message = "Failed to delete user"
            if (typeof err === "object" && err !== null) {
              const anyErr = err as { data?: unknown; message?: string }
              const dataMessage = typeof anyErr.data === "string" ? anyErr.data : undefined
              message = dataMessage ?? anyErr.message ?? message
            } else if (typeof err === "string") {
              message = err
            }
            toast.error(message)
    }
    }
  }
  const updateHandler = async (id: string) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
      });
      setEditableUserId("");
      refetch();
      toast.success("User updated successfully");
    } catch (err: unknown) {
      console.error(err)
            let message = "Failed to update user"
            if (typeof err === "object" && err !== null) {
              const anyErr = err as { data?: unknown; message?: string }
              const dataMessage = typeof anyErr.data === "string" ? anyErr.data : undefined
              message = dataMessage ?? anyErr.message ?? message
            } else if (typeof err === "string") {
              message = err
            }
            toast.error(message)
    }
  };
  const toggleEdit = (id: string, username: string) => {
    setEditableUserId(id);
    setEditableUserName(username);
  };
  const cancelEdit = () => {
    setEditableUserId("");
    setEditableUserName("");
  };
   const getRoleBadge = (role : 'admin' | 'user') => {
    const roleConfig = {
      admin: { color: 'bg-green-500 text-white', icon: Shield },
      user: { color: 'bg-sky-200 text-black', icon: Users }
    };
    const config = roleConfig[role] || roleConfig.user;
    const IconComponent = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      </div>
    );
  }
  if (error) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">All Orders</h1>
          <Alert variant="destructive">
            <AlertDescription>
               An error occurred while loading your orders
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pl-5 lg:ml-[160px] xl:ml-[60px]">
      <div className="max-w-6xl mx-auto">
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="bg-white border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-black" />
                <div>
                  <CardTitle className="text-2xl font-bold text-black">Users Management</CardTitle>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage user accounts and permissions</p>
                </div>
              </div>
              <Badge className="bg-black text-white text-sm sm:text-lg px-3 py-1 sm:px-4 sm:py-2 self-start sm:self-auto">
                {users?.length} Users
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto min-w-0">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-black uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-black uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-black uppercase tracking-wider hidden md:table-cell">
                      Email
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-black uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-black uppercase tracking-wider hidden sm:table-cell">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users?.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-mono text-gray-600">
                          #{user._id}
                        </span>
                      </td>
                      
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        {editableUserId === user._id ? (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <Input
                              type="text"
                              value={editableUserName}
                              onChange={(e) => setEditableUserName(e.target.value)}
                              className="w-full sm:min-w-[150px] md:min-w-[200px] border-gray-300 focus:border-black focus:ring-black text-sm"
                              placeholder="Enter username"
                            />
                            <div className="flex gap-1 sm:gap-2">
                              <Button
                                onClick={() => updateHandler(user._id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3"
                              >
                                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                onClick={cancelEdit}
                                size="sm"
                                variant="outline"
                                className="border-gray-300 hover:bg-gray-50 text-gray-700 px-2 sm:px-3"
                              >
                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-black truncate max-w-[120px] sm:max-w-none">
                              {user.username}
                            </span>
                            <Button
                              onClick={() => toggleEdit(user._id, user.username)}
                              size="sm"
                              variant="ghost"
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1 sm:p-2"
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                      
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 flex-shrink-0" />
                          <a 
                            href={`mailto:${user.email}`}
                            className="text-sm text-black hover:text-gray-600 transition-colors truncate max-w-[150px] xl:max-w-none"
                          >
                            {user.email}
                          </a>
                        </div>
                      </td>
                      
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {user.role !== "admin" && (
                          <Button
                            onClick={() => deleteHandler(user._id)}
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UsersList