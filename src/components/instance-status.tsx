import { Badge } from "./ui/badge";

export function InstanceStatus({ status }: { status: string }) {
  if (!status) {
    return null;
  }

  if (status === "open") return <Badge>Conectada</Badge>;

  if (status === "connecting")
    return <Badge variant="warning">Conectando</Badge>;

  if (status === "close" || status === "closed")
    return <Badge variant="destructive">Desconectado</Badge>;

  return <Badge variant="secondary">{status}</Badge>;
}
