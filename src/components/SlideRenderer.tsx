import { Slide } from '../types/carousel';
import { UserSettings } from '../types/settings';
import * as Template1 from './templates/Template1';
import * as Template2 from './templates/Template2';
import { ChevronDown } from 'lucide-react';

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
  design_template: 'template1',
  end_page_title: 'Your Name',
  end_page_subtitle: 'Follow me for more content',
  end_page_cta: 'Follow for more content',
  end_page_contact: '',
  end_page_image: '',
  created_at: '',
  updated_at: ''
};

export default function SlideRenderer({ slide, totalSlides, settings = DEFAULT_SETTINGS }: SlideRendererProps) {
  const template = settings.design_template || 'template1';
  const showNextIndicator = slide.slide_number < totalSlides;

  const templates = {
    template1: Template1,
    template2: Template2
  };

  const Template = templates[template];

  let slideContent;

  if (slide.type === 'cover') {
    if (template === 'template1') slideContent = <Template.Template1Cover slide={slide} totalSlides={totalSlides} settings={settings} />;
    else if (template === 'template2') slideContent = <Template.Template2Cover slide={slide} totalSlides={totalSlides} settings={settings} />;
  } else if (slide.type === 'cta') {
    if (template === 'template1') slideContent = <Template.Template1CTA slide={slide} totalSlides={totalSlides} settings={settings} />;
    else if (template === 'template2') slideContent = <Template.Template2CTA slide={slide} totalSlides={totalSlides} settings={settings} />;
  } else if (slide.type === 'subscribe') {
    if (template === 'template1') slideContent = <Template.Template1End settings={settings} />;
    else if (template === 'template2') slideContent = <Template.Template2End settings={settings} />;
  } else {
    if (template === 'template1') slideContent = <Template.Template1Content slide={slide} totalSlides={totalSlides} settings={settings} />;
    else if (template === 'template2') slideContent = <Template.Template2Content slide={slide} totalSlides={totalSlides} settings={settings} />;
    else slideContent = <Template.Template1Content slide={slide} totalSlides={totalSlides} settings={settings} />;
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
