export function getFacebookAppID() {
  return import.meta.env.VITE_FACEBOOK_APP_ID || "";
}

export function getFacebookConfigID() {
  return import.meta.env.VITE_FACEBOOK_CONFIG_ID || "";
}

export function getFacebookUserToken() {
  return import.meta.env.VITE_FB_USER_TOKEN || "";
}
