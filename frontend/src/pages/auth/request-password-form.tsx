
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
const ResetPasswordForm = () => {
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
    } catch (err: any) {
      console.log(err);
      // Thêm toast error để user biết
      toast.error(err?.data?.message || "Failed to send OTP");
    }
  };
  return (
<div className="flex flex-row relative h-screen w-screen mx-5 my-5">
      <Card className="w-full max-w-md flex justify-center">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email to receive an OTP for password reset
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")} // Bỏ validation thừa vì đã có zod
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              {error && (
                <p className="text-red-500">
                  {error?.data?.message || "Something went wrong"}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );

}

export default ResetPasswordForm