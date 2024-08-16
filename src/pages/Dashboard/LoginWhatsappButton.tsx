import { Button } from "@/components/ui/button";
import {
  getFacebookAppID,
  getFacebookConfigID,
  getFacebookUserToken,
} from "@/utils/getConfig";
import axios from "axios";
import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type LoginWhatsappButtonProps = {
  setNumber: (number: string) => void;
  setBusiness: (business: string) => void;
  setToken: (token: string) => void;
};

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
    fbq: any;
  }
}

function LoginWhatsappButton({
  setNumber,
  setBusiness,
  setToken,
}: LoginWhatsappButtonProps) {
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

    ((d, s, id) => {
      let js: HTMLScriptElement | null = d.getElementById(
        id
      ) as HTMLScriptElement;
      const fjs = d.getElementsByTagName(s)[0] as HTMLElement;
      if (js) {
        return;
      }
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      if (fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    })(document, "script", "facebook-jssdk");

    window.addEventListener("message", sessionInfoListener);

    return () => {
      window.removeEventListener("message", sessionInfoListener);
    };
  }, []);

  const sessionInfoListener = (event: MessageEvent) => {
    if (
      event.origin !== "https://www.facebook.com" &&
      event.origin !== "https://web.facebook.com"
    ) {
      return;
    }

    try {
      const data = JSON.parse(event.data);
      if (data.type === "WA_EMBEDDED_SIGNUP") {
        if (data.event === "FINISH") {
          const { phone_number_id, waba_id } = data.data;
          registerWaba(phone_number_id, waba_id);
        }
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
      // console.log("Non JSON Response", event.data);
    }
  };

  async function registerWaba(number: string, businessId: string) {
    if (!number || !businessId) return;

    try {
      await axios.post(
        `https://graph.facebook.com/v20.0/${number}/register`,
        {
          messaging_product: "whatsapp",
          pin: "123456",
        },
        {
          headers: {
            Authorization: `Bearer ${getFacebookUserToken()}`,
          },
        }
      );

      await axios.post(
        `https://graph.facebook.com/v20.0/${businessId}/subscribed_apps`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getFacebookUserToken()}`,
          },
        }
      );

      setNumber(number);
      setBusiness(businessId);
      setToken(getFacebookUserToken());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function launchWhatsAppSignup() {
    setLoading(true);
    // Conversion tracking code
    if (window.fbq) {
      window.fbq("trackCustom", "WhatsAppOnboardingStart", {
        appId: getFacebookAppID(),
        feature: "whatsapp_embedded_signup",
      });
    }

    // Launch Facebook login
    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          //
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      {
        config_id: getFacebookConfigID(),
        response_type: "code",
        override_default_response_type: true,
        extras: {
          feature: "whatsapp_embedded_signup",
          sessionInfoVersion: 2,
        },
      }
    );
  }

  return (
    <Button
      variant="default"
      onClick={launchWhatsAppSignup}
      className="bg-green-600 text-white hover:bg-green-700"
      type="button"
      disabled={loading}
    >
      {loading ? "Conectando..." : "Conectar Whatsapp"}
    </Button>
  );
}

export { LoginWhatsappButton };
