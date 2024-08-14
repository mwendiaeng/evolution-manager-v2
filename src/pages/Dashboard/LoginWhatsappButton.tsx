import { Button } from "@/components/ui/button";
import { useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type LoginWhatsappButtonProps = {
  setNumber: (number: string) => void;
  setBusiness: (business: string) => void;
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
}: LoginWhatsappButtonProps) {
  useEffect(() => {
    const script = document.createElement("script");
    const src = "https://connect.facebook.net/en_US/sdk.js";

    script.src = src;
    script.async = true;

    document.body.appendChild(script);

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: "1236499684427109",
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
          setNumber(phone_number_id);
          setBusiness(waba_id);
        }
      }
    } catch {
      // console.log("Non JSON Response", event.data);
    }
  };

  function launchWhatsAppSignup() {
    // Conversion tracking code
    if (window.fbq) {
      window.fbq("trackCustom", "WhatsAppOnboardingStart", {
        appId: "1236499684427109",
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
        config_id: "449052921382894",
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
      className=""
      type="button"
    >
      Conectar Whatsapp
    </Button>
  );
}

export { LoginWhatsappButton };
