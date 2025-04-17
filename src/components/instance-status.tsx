import { useTranslation } from "react-i18next";

import { Badge } from "./ui/badge";

export function InstanceStatus({ connected }: { connected: boolean }) {
  const { t } = useTranslation();

  if (connected) return <Badge>{t("status.open")}</Badge>;

  if (!connected)
    return <Badge variant="destructive">{t("status.closed")}</Badge>;

  return <Badge variant="secondary">{status}</Badge>;
}
