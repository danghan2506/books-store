import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "@/redux/API/user-api-slice";
import { setCredentials } from "@/redux/features/auth/auth-slice";
import { toast } from "sonner"
import type { RootState } from "@/redux/features/store";
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/validation/auth-schema";
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const { search } = useLocation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
   const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
    });
  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await login({ 
        email: data.email, 
        password: data.password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Login successfully!")
      
      // Redirect based on user role
      if (res.role === "admin") {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error.message);
    }
  };
  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(redirect, { replace: true });
      }
    }
  }, [navigate, redirect, userInfo]);
  return (
    <div className="flex flex-row relative h-screen w-screen mx-5 my-5">
      <Card className="w-full max-w-md flex justify-center">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
                <a
                  href="/request-reset-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <CardFooter className="flex-col gap-2 mt-5">
              <Button type="submit" className="w-full cursor-pointer">
                Login
              </Button>
              <Button variant="outline" className="w-full cursor-pointer">
                Login with Google
              </Button>
            </CardFooter>
            <CardAction className="flex items-center justify-end gap-2 w-full ml-6">
              <CardDescription className="m-2">
                New customer?
              </CardDescription>
              <Link to={redirect ? `/signup?redirect=${redirect}` : "/signup"}>
                <Button variant="link" className="cursor-pointer p-0 h-auto">
                  Signup
                </Button>
              </Link>
            </CardAction>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}