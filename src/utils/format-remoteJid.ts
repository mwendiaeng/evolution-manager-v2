export function formatRemoteJid(remoteJid: string) {
  try {
    // Remove qualquer parte após o @ (como @s.whatsapp.net ou @g.us)
    const phone = remoteJid.split("@s.whatsapp.net")[0];

    // Verifica se é um número válido
    if (!/^\d+$/.test(phone)) {
      return remoteJid; // Retorna original se não for número
    }

    // Se o número não começar com código do país (pelo menos 2 dígitos)
    // ou não tiver DDD (mais 2 dígitos), retorna o original
    if (phone.length < 4) {
      return remoteJid.split("@")[0];
    }

    // Extrai as partes do número
    const countryCode = phone.slice(0, 2);
    const ddd = phone.slice(2, 4);
    const phoneNumber = phone.slice(4);

    // Verifica se tem números suficientes para formatar
    if (phoneNumber.length < 8) {
      return remoteJid.split("@")[0];
    }

    // Formata o número dependendo do tamanho (8 ou 9 dígitos)
    const phoneNumberWithDot =
      phoneNumber.length === 8
        ? phoneNumber.replace(/(\d{4})(\d{4})/, "$1-$2")
        : phoneNumber.replace(/(\d{5})(\d{4})/, "$1-$2");

    return `+${countryCode} (${ddd}) ${phoneNumberWithDot}`;
  } catch (error) {
    console.warn("Erro ao formatar número:", remoteJid);
    return remoteJid; // Em caso de erro, retorna o original
  }
}
