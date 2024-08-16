import { useEffect, useState } from "react";

import { verifyServer } from "@/services/auth.service";

import { Button } from "./ui/button";

function Footer() {
  const [version, setVersion] = useState<string | null>(null);
  const clientName = localStorage.getItem("clientName");

  useEffect(() => {
    const url = localStorage.getItem("apiUrl");

    if (!url) return;

    verifyServer(url).then((data) => setVersion(data.version));
  }, []);

  const links = [
    {
      name: "Discord",
      url: "https://evolution-api.com/discord",
    },
    {
      name: "Postman",
      url: "https://evolution-api.com/postman",
    },
    {
      name: "GitHub",
      url: "https://github.com/EvolutionAPI/evolution-api",
    },
    {
      name: "Docs",
      url: "https://doc.evolution-api.com",
    },
  ];

  return (
    <footer className="flex w-full items-center justify-between p-6 text-xs text-secondary-foreground">
      <div className="flex items-center space-x-3 divide-x">
        {clientName && clientName !== "" && (
          <span>
            Client Name: <strong>{clientName}</strong>
          </span>
        )}
        {version && version !== "" && (
          <span className="pl-3">
            Version: <strong>{version}</strong>
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {links.map((link) => (
          <Button
            variant="link"
            asChild
            key={link.url}
            size="sm"
            className="text-xs"
          >
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.name}
            </a>
          </Button>
        ))}
      </div>
    </footer>
  );
}

export { Footer };
