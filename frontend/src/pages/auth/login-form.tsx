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
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/api/user-api-slice";
import { setCredentials } from "../../redux/features/Auth/auth-slice";
import { toast } from "sonner"
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const { search } = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Login successfully!")
      navigate(redirect)
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect, {replace: true});
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
        <form onSubmit={submitHandler}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <a
                  href="#"
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