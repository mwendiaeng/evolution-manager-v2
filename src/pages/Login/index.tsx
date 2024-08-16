import "./style.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Footer } from "@/components/footer";
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

import {
  logout,
  saveCredentials,
  verifyCreds,
  verifyServer,
} from "@/services/auth.service";

function Login() {
  const navigate = useNavigate();

  const [serverUrl, setServerUrl] = useState(
    window.location.protocol + "//" + window.location.host,
  );
  const [apiKey, setApiKey] = useState("");

  const handleLogin = async () => {
    if (!serverUrl || !apiKey) {
      toast.error("Credenciais inválidas");
      return;
    }

    const server = await verifyServer(serverUrl);

    if (!server || !server.version) {
      logout();
      toast.error("Servidor inválido");
      return;
    }

    const verify = await verifyCreds(serverUrl, apiKey);

    if (!verify) {
      toast.error("Credenciais inválidas");
      return;
    }

    const saveCreds = await saveCredentials(serverUrl, apiKey);

    if (!saveCreds) {
      toast.error("Credenciais inválidas");
      return;
    }

    localStorage.setItem("version", server.version);
    localStorage.setItem("clientName", server.clientName);

    navigate("/manager/");
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
        <Card className="no-border w-[350px]">
          <CardHeader>
            <CardTitle className="text-center">Evolution Manager</CardTitle>
            <CardDescription className="text-center">
              Login to your evolution api server
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label className="text-center" htmlFor="serverUrl">
                  Server URL
                </Label>
                <Input
                  className="border border-gray-300"
                  id="serverUrl"
                  placeholder="Server URL"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
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
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
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
