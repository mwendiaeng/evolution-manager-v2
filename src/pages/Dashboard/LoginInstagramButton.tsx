import { Button } from "@/components/ui/button";
import { getFacebookAppID } from "@/utils/getConfig";
import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type LoginInstagramButtonProps = {
  setUserID: (userID: string) => void;
  setToken: (token: string) => void;
};

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
    fbq: any;
  }
}

function LoginInstagramButton({
  setUserID,
  setToken,
}: LoginInstagramButtonProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    const src = "https://connect.facebook.net/en_US/sdk.js";

    script.src = src;
    script.async = true;

    document.body.appendChild(script);

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: getFacebookAppID(),
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
    };
  }, []);

  function handleFacebookLogin() {
    setLoading(true);
    window.FB.login(
      (response: any) => {
        handleLoginResponse(response);
      },
      {
        scope:
          "public_profile,instagram_basic,instagram_manage_messages,pages_messaging,pages_show_list,pages_manage_metadata,pages_read_engagement",
      }
    );
  }

  async function handleLoginResponse(response: any) {
    if (response.authResponse) {
      const { userID, accessToken } = response.authResponse;

      try {
        window.FB.api(
          "/me",
          { fields: "name, email" },
          function (userInfo: any) {
            console.log(
              "Good to see you, " +
                userInfo.name +
                ". I see your email address is " +
                userInfo.email
            );
          }
        );

        setUserID(userID);
        setToken(accessToken);
        // Lógica adicional para interagir com a API do Messenger
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      console.log("User cancelled login or did not fully authorize.");
    }
  }

  return (
    <Button
      variant="default"
      onClick={handleFacebookLogin}
      className="bg-[#983b71] text-white hover:bg-[#5a2d6f]"
      type="button"
      disabled={loading}
    >
      {loading ? "Conectando..." : "Conectar Instagram"}
    </Button>
  );
}

export { LoginInstagramButton };
