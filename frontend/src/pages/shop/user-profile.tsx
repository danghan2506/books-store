import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RootState } from "@/redux/features/store"
import { useDispatch, useSelector } from "react-redux"
import { User, Lock, Mail, Phone, MapPin, Globe } from "lucide-react";
import React from "react"
import { useUpdateUserProfileMutation } from "@/redux/API/user-api-slice"
import { setCredentials } from "@/redux/features/auth/auth-slice"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileFormData, updateProfileSchema } from "@/validation/auth-schema"

const UserProfile = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const [updateProfile] = useUpdateUserProfileMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: userInfo?.username || "",
      email: userInfo?.email || "",
      phoneNumber: userInfo?.phoneNumber || "",
      addressBook: {
        city: userInfo?.addressBook?.city || "",
        district: userInfo?.addressBook?.district || "",
        country: userInfo?.addressBook?.country || "",
        address: userInfo?.addressBook?.address || "",
      },
    },
  })

  const handleUpdateProfile = async (data: UpdateProfileFormData) => {
    try {
      const res = await updateProfile({
        userId: userInfo?._id,
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        addressBook: {
          city: data.addressBook.city,
          district: data.addressBook.district,
          country: data.addressBook.country,
          address: data.addressBook.address,
        }
      }).unwrap()

      dispatch(setCredentials({ ...res }))
      toast.success("Profile updated successfully")
    } catch (error) {
      // @ts-ignore
      const message = error?.data?.message || "Failed to update profile"
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" size={48} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
              <TabsTrigger value="account" className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2 text-sm font-medium">
                <Lock className="w-4 h-4" />
                Password
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="account" className="space-y-6">
            <Card className="shadow-lg border-0 mx-auto">
              <CardHeader className="rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-5 h-5 text-gray-600" />
                  Account Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Update your personal information and contact details. All fields are required.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit(handleUpdateProfile)}>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        {...register("username")}
                        className="h-11 focus-visible:ring-blue-500"
                        placeholder="Enter your full name"
                      />
                      {errors.username && (
                        <p className="text-sm text-red-600">{errors.username.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="h-11 focus-visible:ring-blue-500"
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        {...register("phoneNumber")}
                        className="h-11 focus-visible:ring-blue-500"
                        placeholder="Enter your phone number"
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        City *
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        {...register("addressBook.city")}
                        className="h-11 focus-visible:ring-blue-500"
                        placeholder="Enter your city"
                      />
                      {errors.addressBook?.city && (
                        <p className="text-sm text-red-600">{errors.addressBook.city.message}</p>
                      )}
                    </div>

                    {/* District */}
                    <div className="space-y-2">
                      <Label htmlFor="district" className="text-sm font-semibold text-gray-700">
                        District
                      </Label>
                      <Input
                        id="district"
                        type="text"
                        {...register("addressBook.district")}
                        className="h-11 focus-visible:ring-blue-500"
                        placeholder="Enter your district (optional)"
                      />
                      {errors.addressBook?.district && (
                        <p className="text-sm text-red-600">{errors.addressBook.district.message}</p>
                      )}
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        Country *
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        {...register("addressBook.country")}
                        className="h-11 focus-visible:ring-blue-500"
                        placeholder="Enter your country"
                      />
                      {errors.addressBook?.country && (
                        <p className="text-sm text-red-600">{errors.addressBook.country.message}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                        Address *
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        {...register("addressBook.address")}
                        className="h-11 focus-visible:ring-blue-500"
                        placeholder="Enter your full address"
                      />
                      {errors.addressBook?.address && (
                        <p className="text-sm text-red-600">{errors.addressBook.address.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 rounded-b-lg p-6 flex justify-center">
                  <Button 
                    type="submit"
                    className="w-full sm:w-auto mx-auto bg-blue-600 hover:bg-blue-700 h-11 px-8 font-semibold"
                  >
                    Update
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Password Tab (giữ nguyên như cũ) */}
          <TabsContent value="password" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Lock className="w-5 h-5 text-gray-600" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Update your password to keep your account secure. You'll be logged out after saving.
                </CardDescription>
              </CardHeader>
              <form>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700">
                        Current Password *
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        // value={passwordData.currentPassword}
                        // onChange={(e) => updatePasswordField('currentPassword', e.target.value)}
                        // className={h-11 ${passwordErrors.currentPassword ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-blue-500'}}
                        placeholder="Enter your current password"
                      />
                      {/* {passwordErrors.currentPassword && (
                        <p className="text-sm text-red-600">{passwordErrors.currentPassword}</p>
                      )} */}
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">
                        New Password *
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        // value={passwordData.newPassword}
                        // onChange={(e) => updatePasswordField('newPassword', e.target.value)}
                        // className={h-11 ${passwordErrors.newPassword ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-blue-500'}}
                        placeholder="Enter your new password"
                      />
                      {/* {passwordErrors.newPassword && (
                        <p className="text-sm text-red-600">{passwordErrors.newPassword}</p>
                      )} */}
                      <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                        Confirm New Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        // value={passwordData.confirmPassword}
                        // onChange={(e) => updatePasswordField('confirmPassword', e.target.value)}
                        // className={h-11 ${passwordErrors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-blue-500'}}
                        placeholder="Confirm your new password"
                      />
                      {/* {passwordErrors.confirmPassword && (
                        <p className="text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                      )} */}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 rounded-b-lg p-6">
                  <div className="w-full flex flex-col sm:flex-row gap-3">
                    <Button 
                      type="submit" 
                      // disabled={isPasswordLoading}
                      className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-800 h-11 px-8 font-semibold"
                    >
                      {/* {isPasswordLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        'Update Password'
                      )} */}
                    </Button>
                    <p className="text-xs text-gray-500 flex items-center">
                      You will be logged out after changing your password
                    </p>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
export default UserProfile
