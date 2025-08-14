import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux/API/auth-api-slice";
import {
  type UpdatePasswordFormData,
  updatePasswordSchema,
} from "@/validation/auth-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Lock, EyeOff, Eye } from "lucide-react";
const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });
  // Lay email tu query hoac localStorage
  const email = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("email") || localStorage.getItem("resetEmail") || "";
  }, [location.search]);

  const onSubmit = async (data: UpdatePasswordFormData) => {
    if (!email) {
      toast.error("Missing email. Please request OTP again.");
      navigate("/request-reset-password", { replace: true });
      return;
    }
    if (!data.newPassword || !data.confirmPassword) {
      toast.error("Please enter password and confirmation");
      return;
    }
    try {
      await resetPassword({
        email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      toast.success("Password has been reset. Please login.");
      localStorage.removeItem("resetEmail");
      navigate("/login");
    } 
    catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const errorData = (err as { data?: { message?: string } }).data;
        toast.error(errorData?.message || "Failed to reset password");
      } else {
        toast.error("Failed to reset password");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50 p-4">
      <Card className="w-full max-w-lg shadow-xl border border-blue-100 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-800">
            Reset Password
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Enter your new password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
<CardContent className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="pasword"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                {...register("newPassword")}
                className="pl-10 pr-10 h-12 text-base border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.newPassword.message}
                </p>
              )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className="pl-10 pr-10 h-12 text-base border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Button className="w-full h-12 text-base font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200" type="submit" size="lg" disabled={isLoading}>
            {isLoading ? "Saving..." : "Reset Password"}
          </Button>
        </CardFooter>
        </form>
      </Card>
    </div>
  );
};
export default ResetPassword;
