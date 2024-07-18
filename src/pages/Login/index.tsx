import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import "./style.css";
import { Footer } from "@/components/footer";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="pt-2">
        <img
          className="logo"
          src="/assets/images/evolution-logo.png"
          alt="logo"
        />
      </div>
      <div className="root">
        <Card className="w-[350px] no-border">
          <CardHeader>
            <CardTitle className="text-center">Evolution Manager</CardTitle>
            <CardDescription className="text-center">
              Login to your evolution api server
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label className="text-center" htmlFor="serverUrl">
                    Server URL
                  </Label>
                  <Input
                    className="border border-gray-300"
                    id="serverUrl"
                    placeholder="Server URL"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label className="text-center" htmlFor="apiKey">
                    Global ApiKey
                  </Label>
                  <Input
                    id="apiKey"
                    className="border border-gray-300"
                    placeholder="Global ApiKey"
                    type="password"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
