import { Button } from "./ui/button";

function Footer() {
  const version = localStorage.getItem("version");
  const clientName = localStorage.getItem("clientName");

  return (
    <footer className="footer">
      <div className="footer-info flex items-center space-x-3 divide-x">
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
