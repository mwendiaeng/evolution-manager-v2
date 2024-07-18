import { Button } from "./ui/button";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-info">
        Client Name: <strong>Evolution Manager</strong> Version:{" "}
        <strong>1.0.0</strong>
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
