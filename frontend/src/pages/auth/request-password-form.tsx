
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { type EmailOnlyFormData, emailOnlySchema } from "@/validation/auth-schema";
import { useRequestPasswordResetMutation } from "@/redux/API/auth-api-slice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailOnlyFormData>({
    resolver: zodResolver(emailOnlySchema),
  });
  const [sendEmail, {isLoading, error}] = useRequestPasswordResetMutation()
  const onSubmit = async (data: EmailOnlyFormData) => {
    try {
      // Đúng: gửi chỉ email string
      await sendEmail({email: data.email}).unwrap();
      toast.success("OTP has been sent to your email");
      // if success, redirect to verify OTP page 
      localStorage.setItem("resetEmail", data.email);
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      // Thêm toast error để user biết
      const apiErr = err as { data?: { message?: string }; message?: string };
      const message = apiErr?.data?.message || apiErr?.message || "Failed to send OTP";
      toast.error(message);
    }
  };
  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50 p-4">
      <Card className="w-full max-w-lg shadow-xl border border-blue-100 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-800">Reset your password</CardTitle>
          <CardDescription className="text-base text-gray-600">
            Enter your email to receive an OTP for password reset
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")} 
                  className="h-12 text-base border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              {error && <p className="text-red-500">Something went wrong</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button type="submit" className="w-full hover:shadow-lg hover:scale-[1.02] transition-all duration-200" disabled={isLoading} >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending OTP to your email....</span>
                </div>
              ) : (
                "Send OTP"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );

}

export default ResetPasswordForm