import { Slide } from '../types/carousel';
import { UserSettings } from '../types/settings';
import { ChevronDown } from 'lucide-react';
import { parseMarkdown } from '../utils/markdown';

interface SlideRendererProps {
  slide: Slide;
  totalSlides: number;
  settings?: UserSettings;
}

const DEFAULT_SETTINGS: UserSettings = {
  id: '',
  user_id: '',
  primary_color: '#0A66C2',
  show_signature: false,
  signature_name: '',
  cover_alignment: 'centered',
  signature_position: 'bottom-right',
  content_style: 'split',
  show_slide_numbers: true,
  content_alignment: 'centered',
  end_page_title: 'Your Name',
  end_page_subtitle: 'Follow me for more content',
  end_page_cta: 'Follow for more content',
  end_page_contact: '',
  end_page_image: '',
  created_at: '',
  updated_at: ''
};

function CoverSlide({ slide, settings }: { slide: Slide; settings: UserSettings }) {
  const alignment = settings.cover_alignment === 'centered' ? 'items-center text-center' : 'items-start text-left';
  const signaturePosition = settings.signature_position === 'bottom-right' ? 'bottom-8 right-8' : 'bottom-8 left-8';

  return (
    <div className="w-full h-full bg-white flex flex-col justify-center p-12" style={{ backgroundColor: settings.primary_color }}>
      <div className={`flex flex-col ${alignment}`}>
        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="text-2xl text-white/90">
            {slide.subtitle}
          </p>
        )}
      </div>

      {settings.show_signature && settings.signature_name && (
        <div className={`absolute ${signaturePosition} text-white/80 text-sm`}>
          {settings.signature_name}
        </div>
      )}
    </div>
  );
}

function TitleSlide({ slide, totalSlides, settings }: { slide: Slide; totalSlides: number; settings: UserSettings }) {
  return (
    <div className="w-full h-full bg-white flex items-center justify-center p-12" style={{ backgroundColor: settings.primary_color }}>
      <div className="w-full">
        <h2 className="text-4xl font-bold text-white leading-tight">
          {slide.title}
        </h2>
        {slide.stats && (
          <p className="text-2xl text-white/80 mt-4">
            {slide.stats}
          </p>
        )}
        {settings.show_slide_numbers && (
          <div className="text-white/80 text-xl mt-4">
            {slide.slide_number} / {totalSlides}
          </div>
        )}
      </div>
    </div>
  );
}

function ContentSlide({ slide, totalSlides, settings }: { slide: Slide; totalSlides: number; settings: UserSettings }) {
  const contentAlignment = settings.content_alignment === 'centered' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className="w-full h-full bg-white flex flex-col justify-center p-12">
      <div className={`flex flex-col ${contentAlignment}`}>
        {slide.title && (
          <h2 className="text-4xl font-bold mb-6 leading-tight" style={{ color: settings.primary_color }}>
            {slide.title}
          </h2>
        )}
        <div className="text-gray-800 text-lg leading-relaxed space-y-4">
          {parseMarkdown(slide.content)}
        </div>
      </div>
    </div>
  );
}

function CTASlide({ slide, settings }: { slide: Slide; settings: UserSettings }) {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center p-12" style={{ backgroundColor: settings.primary_color }}>
      <h2 className="text-5xl font-bold text-white mb-6 text-center leading-tight">
        {slide.title}
      </h2>
      {slide.content && (
        <p className="text-2xl text-white/90 text-center max-w-2xl">
          {slide.content}
        </p>
      )}
    </div>
  );
}

function EndSlide({ settings }: { settings: UserSettings }) {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center p-12">
      {settings.end_page_image && (
        <div className="mb-8">
          <img
            src={settings.end_page_image}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
            style={{ border: `4px solid ${settings.primary_color}` }}
          />
        </div>
      )}

      <h2 className="text-5xl font-bold text-gray-900 mb-4 text-center">
        {settings.end_page_title}
      </h2>

      <p className="text-2xl text-gray-600 mb-8 text-center max-w-lg">
        {settings.end_page_subtitle}
      </p>

      {settings.end_page_contact && (
        <div className="text-lg text-gray-700">
          {settings.end_page_contact}
        </div>
      )}
    </div>
  );
}

export default function SlideRenderer({ slide, totalSlides, settings = DEFAULT_SETTINGS }: SlideRendererProps) {
  const showNextIndicator = slide.slide_number < totalSlides;

  let slideContent;

  if (slide.type === 'cover') {
    slideContent = <CoverSlide slide={slide} settings={settings} />;
  } else if (slide.type === 'title') {
    slideContent = <TitleSlide slide={slide} totalSlides={totalSlides} settings={settings} />;
  } else if (slide.type === 'cta') {
    slideContent = <CTASlide slide={slide} settings={settings} />;
  } else if (slide.type === 'subscribe') {
    slideContent = <EndSlide settings={settings} />;
  } else {
    slideContent = <ContentSlide slide={slide} totalSlides={totalSlides} settings={settings} />;
  }

  return (
    <div className="relative w-full aspect-square">
      {slideContent}
      {showNextIndicator && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center animate-bounce">
            <ChevronDown size={32} className="text-white/70 drop-shadow-lg" strokeWidth={3} />
          </div>
        </div>
      )}
    </div>
  );
}
