export type CarouselStatus = 'draft' | 'exported';
export type SlideType = 'cover' | 'content' | 'cta' | 'subscribe';
export type CarouselLanguage = 'fr' | 'en';
export type ContentFormat = 'bullets' | 'paragraph';
export type ContentLength = 'short' | 'medium' | 'long' | 'auto';

export interface Slide {
  id: string;
  carousel_id: string;
  slide_number: number;
  type: SlideType;
  title: string;
  subtitle?: string;
  bullets?: string[];
  content?: string;
  stats?: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export type SlideCount = 5 | 10 | 15 | number;

export interface Carousel {
  id: string;
  title: string;
  subject: string;
  status: CarouselStatus;
  slide_count: number;
  language: CarouselLanguage;
  content_format: ContentFormat;
  hashtags?: string[];
  pdf_url?: string;
  created_at: string;
  updated_at: string;
  slides?: Slide[];
}

export interface GenerationRequest {
  subject: string;
  slide_count: SlideCount;
  language: CarouselLanguage;
  content_format: ContentFormat;
}

export interface GenerationProgress {
  stage: 'analyzing' | 'researching' | 'structuring' | 'generating' | 'visualizing' | 'complete';
  progress: number;
  message: string;
}
