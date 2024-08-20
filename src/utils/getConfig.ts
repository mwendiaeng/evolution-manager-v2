export function getFacebookAppID() {
  return localStorage.getItem("facebookAppId") || "";
}

export function getFacebookConfigID() {
  return localStorage.getItem("facebookConfigId") || "";
}

export function getFacebookUserToken() {
  return localStorage.getItem("facebookUserToken") || "";
}
