export const CSRF_TOKEN_LENGTH = 16;
const CSRF_TOKEN_KEY = "google-oauth2-demo-csrf";

export const generateCSRFToken = () => {  
  let token = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (let i=0; i<CSRF_TOKEN_LENGTH; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token
}

export const storeCSRFToken = (token: string) => {
  try {
    localStorage.setItem(CSRF_TOKEN_KEY, token);
  } catch (e) {
    console.error(e);
  }
}

export const getCSRFToken = () => {
  try {
    return localStorage.getItem(CSRF_TOKEN_KEY)
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const clearCSRFToken = () => {
  try {
    localStorage.removeItem(CSRF_TOKEN_KEY);
  } catch (e) {
    console.error(e);
  }
}
