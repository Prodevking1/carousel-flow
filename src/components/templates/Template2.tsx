import { Slide } from '../../types/carousel';
import { UserSettings } from '../../types/settings';
import { parseMarkdown } from '../../utils/markdown';

interface TemplateProps {
  slide: Slide;
  totalSlides: number;
  settings: UserSettings;
}

export function Template2Cover({ slide, settings }: TemplateProps) {
  return (
    <div className="w-full aspect-square relative overflow-hidden bg-white">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-16">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-6 leading-tight">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="text-2xl text-gray-600 text-center leading-snug mb-8">
            {slide.subtitle}
          </p>
        )}
        {settings.show_signature && settings.signature_name && (
          <div className="absolute bottom-16 right-16">
            <p className="text-xl text-gray-700 font-medium">
              {settings.signature_name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Template2Content({ slide, totalSlides, settings }: TemplateProps) {
  const primaryColor = settings.primary_color;

  return (
    <div className="w-full aspect-square relative overflow-hidden bg-white">
      <div className="absolute inset-0 flex flex-col p-16">
        <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
          {slide.title}
        </h2>

        <div className="flex-1 flex flex-col justify-center">
          {slide.subtitle && (
            <div className="mb-6">
              <h3 className="text-3xl font-semibold text-gray-900 leading-snug">
                {parseMarkdown(slide.subtitle)}
              </h3>
            </div>
          )}

          {slide.content && (
            <div className="mb-6">
              <p className="text-2xl text-gray-700 leading-loose whitespace-pre-line [&>br]:mb-4">
                {parseMarkdown(slide.content)}
              </p>
            </div>
          )}

          {slide.bullets && slide.bullets.length > 0 && (
            <div className="space-y-5">
              {slide.bullets.map((bullet, index) => (
                <div key={index} className="flex items-start gap-5">
                  <div className="text-3xl font-bold" style={{ color: primaryColor }}>
                    →
                  </div>
                  <p className="text-2xl text-gray-700 leading-loose flex-1">{parseMarkdown(bullet)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-8 right-8">
          <div className="text-sm font-semibold text-gray-400">
            {slide.slide_number}/{totalSlides}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Template2CTA({ slide, settings }: TemplateProps) {
  return (
    <div className="w-full aspect-square relative overflow-hidden bg-white">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-16">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-8 leading-tight">
          {slide.title}
        </h2>
        {slide.bullets && slide.bullets.length > 0 && (
          <div className="space-y-4 w-full max-w-2xl">
            {slide.bullets.map((bullet, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-2xl font-bold" style={{ color: settings.primary_color }}>→</div>
                <p className="text-xl text-gray-700 leading-loose">{parseMarkdown(bullet)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Template2End({ settings }: { settings: UserSettings }) {
  return (
    <div className="w-full aspect-square relative overflow-hidden bg-white">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center">
        {settings.end_page_image && (
          <div className="mb-8">
            <img
              src={settings.end_page_image}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover"
              style={{ border: `6px solid ${settings.primary_color}` }}
            />
          </div>
        )}
        <h2 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {settings.end_page_title}
        </h2>
        <p className="text-2xl text-gray-600 mb-6 max-w-xl">
          {settings.end_page_subtitle}
        </p>
        {settings.end_page_contact && (
          <p className="text-lg text-gray-600">{settings.end_page_contact}</p>
        )}
      </div>
    </div>
  );
}
