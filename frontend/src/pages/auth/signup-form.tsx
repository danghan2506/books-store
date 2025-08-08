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
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { setCredentials } from "@/redux/features/auth/auth-slice";
import { toast } from "sonner";
import { useSignupMutation } from "@/redux/API/user-api-slice";
import type { RootState } from "@/redux/features/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/validation/auth-schema";

const SignupForm = () => {
  const [signup] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const onSubmit = async (data: SignupFormData) => {
    try {
      const res = await signup({
        username: data.username,
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Signup successfully!");
    } catch (error: any) {
      toast.error(error.data?.message || "Signup failed");
    }
  };
  return (
    <div className="relative h-screen w-screen mx-5 my-5">
      <Card className="w-full max-w-md flex justify-center">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Fulfill this form to sign up</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  type="text"
                  {...register("username")}
                  placeholder="John Doe"
                  required
                />
                {errors.username && (
                  <p className="text-red-500">{errors.username.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="abc@example.com"
                  required
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
                  {...register("password")}
                  required
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm password</Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  required
                />
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            <CardFooter className="flex-col gap-2 mt-5">
              <Button type="submit" className="w-full cursor-pointer">
                Sign up
              </Button>
            </CardFooter>
            <CardAction className="flex items-center justify-end gap-2 w-full ml-6">
              <CardDescription className="m-2">
                Already have an account?
              </CardDescription>
              <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                <Button variant="link" className="cursor-pointer p-0 h-auto">
                  Login
                </Button>
              </Link>
            </CardAction>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default SignupForm;
