export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || "Agro ERP Enterprise",
  SHORT_NAME: "Agro ERP",
  VERSION: "1.0.0",
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  ROOT_URL: import.meta.env.VITE_ROOT_URL || "http://localhost:8080",
  THEME: "konrix-green",
  MESSAGES: {
    LOGIN_WELCOME: "Welcome Back",
    LOGIN_SUBTITLE: "Please sign in to your enterprise account to continue.",
  },
};
