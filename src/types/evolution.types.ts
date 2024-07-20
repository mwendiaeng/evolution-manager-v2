export type Settings = {
  id: string;
  rejectCall: boolean;
  msgCall: string;
  groupsIgnore: boolean;
  alwaysOnline: boolean;
  readMessages: boolean;
  readStatus: boolean;
  syncFullHistory: boolean;
  createdAt: string;
  updatedAt: string;
  instanceId: string;
};

export type Instance = {
  id: string;
  name: string;
  connectionStatus: string;
  ownerJid: string;
  profileName: string;
  profilePicUrl: string;
  integration: string;
  number: string;
  businessId: string;
  token: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
  Setting: Settings;
};
<<<<<<< HEAD




=======
>>>>>>> 4cc9370dbfe3c7a3d271f87e6e12747f59f42392
