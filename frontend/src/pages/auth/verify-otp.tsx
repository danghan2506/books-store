import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyOtpMutation } from "@/redux/API/auth-api-slice";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [otp, setOtp] = useState("");

  const emailFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("email");
  }, [location.search]);

  const email = emailFromQuery || localStorage.getItem("resetEmail") || "";

  useEffect(() => {
    if (!email) {
      toast.error("Missing email. Please request OTP again.");
      navigate("/request-reset-password", { replace: true });
    }
  }, [email, navigate]);

  const onSubmit = async () => {
    if (!email) return;
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    try {
      await verifyOtp({ email, otp }).unwrap();
      toast.success("OTP verified. You can now reset your password.");
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };

  const resend = () => {
    navigate(`/request-reset-password`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50 p-4">
      <Card className="w-full max-w-lg shadow-xl border border-blue-100 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-2 text-center pb-4">
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-800">Verify OTP</CardTitle>
          <CardDescription className="text-base text-gray-600">
            {email ? `Enter the 6-digit code sent to ${email}` : "Enter the 6-digit code"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="gap-3">
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <InputOTPSlot key={idx} index={idx} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Button className="w-full" onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
          <Button className="w-full" variant="outline" onClick={resend}>Resend</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyOtp;