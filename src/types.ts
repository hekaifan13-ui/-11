
export enum AppState {
  INTRO = 'INTRO',
  SELECTION = 'SELECTION',
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW',
  GALLERY = 'GALLERY'
}

export enum TemplateId {
  MODERN = 'MODERN',
  CODE = 'CODE',
  LIVESTREAM = 'LIVESTREAM'
}

export interface Author {
  id: string;
  name: string;
  title: string;
  image: string | null;
}

export interface PostcardData {
  templateId: TemplateId;
  image: string | null;
  recipient: string;
  message: string;
  sender: string;
  location: string;
  date?: string;
  modernLayout?: 'standard' | 'portrait-full';
  qrCode1?: string | null;
  qrCode2?: string | null;
  qr1Text?: string;
  qr2Text?: string;
  footerText?: string;
  footerFontSize?: number;
  authors?: Author[];
  authorsLayout?: { x: number; y: number; scale: number };
  authorsTextColor?: string;
  authorsGap?: number;
  logos?: string[];
  logoSeparatorColor?: string;
  logoStyle?: 'white-text' | 'black-text';
  liveTopic?: string;
  theme?: 'light' | 'dark';
}

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  previewColor: string;
}

export interface GalleryItem {
  id: string;
  img: string;
  height: number;
  templateId: TemplateId;
  createdAt: string;
}
