import toastService from "./custom-toast.service";

export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text);
  toastService.success("Copiado para a área de transferência");
};
