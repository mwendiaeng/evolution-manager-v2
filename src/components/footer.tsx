import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { verifyServer } from "@/services/auth.service";

function Footer() {
  const [version, setVersion] = useState<string | null>(null);
  const clientName = localStorage.getItem("clientName");

  useEffect(() => {
    const url = localStorage.getItem("apiUrl");

    if (!url) return;

    verifyServer(url)
      .then((data) => setVersion(data.version));
  }, []);

  return (
    <footer className="footer">
      <div className="footer-info">
        Client Name: <strong>{clientName}</strong>{" "}
        Version: <strong>{version}</strong>
      </div>
      <div className="footer-buttons">
        <Button variant="link">
          <a
            href="https://evolution-api.com/discord"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
        </Button>
        <Button variant="link">
          <a
            href="https://evolution-api.com/postman"
            target="_blank"
            rel="noopener noreferrer"
          >
            Postman
          </a>
        </Button>
        <Button variant="link">
          <a
            href="https://github.com/EvolutionAPI/evolution-api"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </Button>
        <Button variant="link">
          <a
            href="https://doc.evolution-api.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
        </Button>
      </div>
    </footer>
  );
}

export { Footer };
