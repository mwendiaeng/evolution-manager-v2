import { Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { copyToClipboard } from "@/utils/copy-to-clipboard";

import { Button } from "./ui/button";

export function InstanceToken({ token }: { token: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center gap-3 self-start truncate rounded-sm bg-primary/20 px-2 py-1">
      <span className="block truncate text-xs">
        {visible ? token : token.replace(/\w/g, "*")}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          copyToClipboard(token);
        }}
      >
        <Copy size="15" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setVisible((old) => !old);
        }}
      >
        {visible ? <EyeOff size="15" /> : <Eye size="15" />}
      </Button>
    </div>
  );
}
