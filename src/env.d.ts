declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";

// اضافه کنید:
interface ImportMetaEnv {
  readonly VITE_BASE_URL: string; // اگر متغیر محیطی دیگری دارید اضافه کنید
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
