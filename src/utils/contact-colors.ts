const CONTACT_COLORS = [
  "text-red-600 dark:text-red-400",
  "text-blue-600 dark:text-blue-400",
  "text-green-600 dark:text-green-400",
  "text-purple-600 dark:text-purple-400",
  "text-yellow-600 dark:text-yellow-400",
  "text-pink-600 dark:text-pink-400",
  "text-indigo-600 dark:text-indigo-400",
  "text-orange-600 dark:text-orange-400",
  "text-teal-600 dark:text-teal-400",
  "text-cyan-600 dark:text-cyan-400",
];

const BG_CONTACT_COLORS = [
  "bg-red-600 dark:bg-red-400",
  "bg-blue-600 dark:bg-blue-400",
  "bg-green-600 dark:bg-green-400",
  "bg-purple-600 dark:bg-purple-400",
  "bg-yellow-600 dark:bg-yellow-400",
  "bg-pink-600 dark:bg-pink-400",
  "bg-indigo-600 dark:bg-indigo-400",
  "bg-orange-600 dark:bg-orange-400",
  "bg-teal-600 dark:bg-teal-400",
  "bg-cyan-600 dark:bg-cyan-400",
];

export const getContactColor = (remoteJid: string): string => {
  const hash = remoteJid.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return CONTACT_COLORS[Math.abs(hash) % CONTACT_COLORS.length];
};

export const getContactBgColor = (remoteJid: string): string => {
  const hash = remoteJid.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return BG_CONTACT_COLORS[Math.abs(hash) % BG_CONTACT_COLORS.length];
};
