import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux/API/auth-api-slice";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const email = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("email") || localStorage.getItem("resetEmail") || "";
  }, [location.search]);

  const onSubmit = async () => {
    if (!email) {
      toast.error("Missing email. Please request OTP again.");
      navigate("/request-reset-password", { replace: true });
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.error("Please enter password and confirmation");
      return;
    }
    try {
      await resetPassword({ email, newPassword, confirmPassword }).unwrap();
      toast.success("Password has been reset. Please login.");
      localStorage.removeItem("resetEmail");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex flex-row relative h-screen w-screen mx-5 my-5">
      <Card className="w-full max-w-md flex justify-center">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Reset Password"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;


