import { Trash2, Edit, Check, X, Mail, Users, Shield, Search, UserPlus } from 'lucide-react';

import { Alert, AlertDescription } from "@/components/ui/alert";

import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { useDeleteUserMutation, useUpdateUserProfileMutation, useGetAllUsersQuery } from "@/redux/API/user-api-slice";
import { useEffect, useState, useMemo } from "react";

const UsersList = () => {
  const { data: users, refetch, isLoading, error } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [editableUserId, setEditableUserId] = useState("");
  const [editableUserName, setEditableUserName] = useState("");
  const [updateUser] = useUpdateUserProfileMutation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user._id.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const adminCount = useMemo(() => users?.filter((u) => u.role === "admin").length ?? 0, [users]);
  const userCount = useMemo(() => users?.filter((u) => u.role === "user").length ?? 0, [users]);

  const deleteHandler = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted successfully");
      } catch (err: unknown) {
        console.error(err);
        let message = "Failed to delete user";
        if (typeof err === "object" && err !== null) {
          const anyErr = err as { data?: unknown; message?: string };
          const dataMessage = typeof anyErr.data === "string" ? anyErr.data : undefined;
          message = dataMessage ?? anyErr.message ?? message;
        } else if (typeof err === "string") {
          message = err;
        }
        toast.error(message);
      }
    }
  };

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
      console.error(err);
      let message = "Failed to update user";
      if (typeof err === "object" && err !== null) {
        const anyErr = err as { data?: unknown; message?: string };
        const dataMessage = typeof anyErr.data === "string" ? anyErr.data : undefined;
        message = dataMessage ?? anyErr.message ?? message;
      } else if (typeof err === "string") {
        message = err;
      }
      toast.error(message);
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

  const getRoleBadge = (role: "admin" | "user") => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-emerald-600/10 dark:ring-emerald-400/20">
          <Shield className="w-3 h-3" />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 ring-1 ring-blue-600/10 dark:ring-blue-400/20">
        <Users className="w-3 h-3" />
        User
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>
              An error occurred while loading users. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                Users Management
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Manage user accounts and permissions
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{users?.length ?? 0}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Users</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/10">
              <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{adminCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Administrators</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10">
              <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{userCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Regular Users</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 rounded-xl focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">
                    User ID
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">
                    Username
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">
                    Email
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">
                    Role
                  </th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="group hover:bg-blue-50/40 dark:hover:bg-slate-700/20 transition-colors duration-150"
                  >
                    <td className="px-5 py-4">
                      <code className="text-xs bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md font-mono text-slate-600 dark:text-slate-300">
                        #{user._id.slice(-8)}
                      </code>
                    </td>

                    <td className="px-5 py-4">
                      {editableUserId === user._id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="min-w-[180px] h-8 text-sm border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            placeholder="Enter username"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") updateHandler(user._id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                          />
                          <Button
                            onClick={() => updateHandler(user._id)}
                            size="sm"
                            className="cursor-pointer h-8 w-8 p-0 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-150"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            onClick={cancelEdit}
                            size="sm"
                            variant="ghost"
                            className="cursor-pointer h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700/50 transition-colors duration-150"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {user.username}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <a
                          href={`mailto:${user.email}`}
                          className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 truncate max-w-[220px]"
                        >
                          {user.email}
                        </a>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {editableUserId !== user._id && (
                          <Button
                            onClick={() => toggleEdit(user._id, user.username)}
                            size="sm"
                            variant="ghost"
                            className="cursor-pointer h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 transition-colors duration-150"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {user.role !== "admin" && (
                          <Button
                            onClick={() => deleteHandler(user._id)}
                            size="sm"
                            variant="ghost"
                            className="cursor-pointer h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors duration-150"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-full mb-4">
                <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                No users found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-sm">
                {searchQuery ? "Try adjusting your search query." : "No users are available."}
              </p>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 rounded-xl p-4 space-y-3 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    {editableUserId === user._id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="text"
                          value={editableUserName}
                          onChange={(e) => setEditableUserName(e.target.value)}
                          className="flex-1 h-8 text-sm border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          placeholder="Enter username"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") updateHandler(user._id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                        />
                        <Button
                          onClick={() => updateHandler(user._id)}
                          size="sm"
                          className="cursor-pointer h-8 w-8 p-0 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {user.username}
                        </span>
                        {getRoleBadge(user.role)}
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <code className="text-xs bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded font-mono text-slate-500 dark:text-slate-400">
                      #{user._id.slice(-8)}
                    </code>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <a
                      href={`mailto:${user.email}`}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                    >
                      {user.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile Actions */}
              {editableUserId !== user._id && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                  <Button
                    onClick={() => toggleEdit(user._id, user.username)}
                    size="sm"
                    variant="ghost"
                    className="cursor-pointer flex-1 h-8 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 rounded-lg transition-colors duration-150"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </Button>
                  {user.role !== "admin" && (
                    <Button
                      onClick={() => deleteHandler(user._id)}
                      size="sm"
                      variant="ghost"
                      className="cursor-pointer flex-1 h-8 text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-colors duration-150"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-full mb-4">
                <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                No users found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-sm">
                {searchQuery ? "Try adjusting your search query." : "No users are available."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;