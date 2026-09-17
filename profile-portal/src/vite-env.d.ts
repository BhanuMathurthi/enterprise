/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_IDP_ISSUER: string;
  readonly VITE_IDP_CLIENT_ID: string;
  readonly VITE_IDP_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
