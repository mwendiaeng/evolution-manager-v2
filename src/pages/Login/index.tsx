import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

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
import { Form, FormInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  logout,
  saveCredentials,
  verifyCreds,
  verifyServer,
} from "@/services/auth.service";

const loginSchema = z.object({
  serverUrl: z
    .string({ required_error: "URL do servidor é obrigatória" })
    .url("URL inválida"),
  apiKey: z.string({ required_error: "ApiKey é obrigatória" }),
});
type LoginSchema = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      serverUrl: window.location.protocol + "//" + window.location.host,
      apiKey: "",
    },
  });

  const handleLogin: SubmitHandler<LoginSchema> = async (data) => {
    const server = await verifyServer(data.serverUrl);

    if (!server || !server.version) {
      logout();
      loginForm.setError("serverUrl", {
        type: "manual",
        message: "Servidor inválido",
      });
      return;
    }

    const verify = await verifyCreds(data.serverUrl, data.apiKey);

    if (!verify) {
      loginForm.setError("apiKey", {
        type: "manual",
        message: "Credenciais inválidas",
      });
      return;
    }

    const saveCreds = await saveCredentials(data.serverUrl, data.apiKey);

    if (!saveCreds) {
      toast.error("Credenciais inválidas");
      return;
    }

    localStorage.setItem("version", server.version);
    localStorage.setItem("clientName", server.clientName);

    navigate("/manager/");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-center pt-2">
        <img
          className="h-10"
          src="/assets/images/evolution-logo.png"
          alt="logo"
        />
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="b-none w-[350px] shadow-none">
          <CardHeader>
            <CardTitle className="text-center">Evolution Manager</CardTitle>
            <CardDescription className="text-center">
              Conecte no servidor de sua API Evolution
            </CardDescription>
          </CardHeader>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <FormInput required name="serverUrl" label="Server URL">
                    <Input />
                  </FormInput>
                  <FormInput required name="apiKey" label="Global ApiKey">
                    <Input type="password" />
                  </FormInput>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button className="w-full" type="submit">
                  Conectar
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
