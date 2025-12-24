import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, ChevronDown } from 'lucide-react';
import { CarouselLanguage, SlideCount, ContentFormat, ContentLength } from '../types/carousel';
import { CoverAlignment, SignaturePosition, ContentStyle, ContentAlignment } from '../types/settings';
import { getOrCreateUserSettings } from '../services/settings';
import { getCurrentUserId } from '../services/user';
import { CustomizeModal } from '../components/CustomizeModal';
import { PreviewCard } from '../components/PreviewCard';

export default function Generate() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [sources, setSources] = useState('');
  const [slideCount, setSlideCount] = useState<SlideCount>(5);
  const [customSlideCount, setCustomSlideCount] = useState<string>('');
  const [slideMode, setSlideMode] = useState<'fixed' | 'auto' | 'custom'>('auto');
  const [language, setLanguage] = useState<CarouselLanguage>('fr');
  const [contentFormat, setContentFormat] = useState<ContentFormat>('paragraph');
  const [contentLength, setContentLength] = useState<ContentLength>('auto');
  const [error, setError] = useState('');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [coverAlignment, setCoverAlignment] = useState<CoverAlignment>('centered');
  const [signaturePosition, setSignaturePosition] = useState<SignaturePosition>('bottom-right');
  const [contentStyle, setContentStyle] = useState<ContentStyle>('split');
  const [showSlideNumbers, setShowSlideNumbers] = useState(true);
  const [contentAlignment, setContentAlignment] = useState<ContentAlignment>('centered');
  const [primaryColor, setPrimaryColor] = useState('#0A66C2');
  const [customizeModalOpen, setCustomizeModalOpen] = useState<'cover' | 'content' | 'end' | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userId = getCurrentUserId();
        const settings = await getOrCreateUserSettings(userId);
        setCoverAlignment(settings.cover_alignment);
        setSignaturePosition(settings.signature_position);
        setContentStyle(settings.content_style);
        setShowSlideNumbers(settings.show_slide_numbers);
        setContentAlignment(settings.content_alignment);
        setPrimaryColor(settings.primary_color);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const languages = [
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const handleGenerate = () => {
    if (subject.trim().length < 3) {
      setError('Subject must be at least 3 characters');
      return;
    }

    let finalSlideCount: number;
    if (slideMode === 'auto') {
      finalSlideCount = 0;
    } else if (slideMode === 'custom') {
      finalSlideCount = parseInt(customSlideCount) || 5;
    } else {
      finalSlideCount = slideCount;
    }

    navigate('/generating', {
      state: { subject: subject.trim(), sources: sources.trim(), slideCount: finalSlideCount, language, contentFormat, contentLength, contentStyle }
    });
  };

  const handleSlideCountClick = (count: number) => {
    setSlideCount(count);
    setSlideMode('fixed');
    setCustomSlideCount('');
  };

  const handleAutoClick = () => {
    setSlideMode('auto');
    setCustomSlideCount('');
  };

  const handleCustomClick = () => {
    setSlideMode('custom');
    setCustomSlideCount('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Carousel</h1>
            <p className="text-gray-600">Tell us what you want to create and let AI do the work</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                What's your carousel about?
              </label>
              <textarea
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setError('');
                }}
                placeholder="How Stripe scaled from 0 to $50B, Marketing strategies that made Airbnb viral, Growth tactics used by Notion to reach 20M users..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y min-h-[100px]"
                maxLength={5000}
              />
              <div className="flex justify-between items-center mt-2">
                {error && <p className="text-sm text-red-600">{error}</p>}
                <p className="text-sm text-gray-500 ml-auto">{subject.length}/5000</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Sources & Data <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                value={sources}
                onChange={(e) => setSources(e.target.value)}
                placeholder="500M+ users, Founded in 2011, $45M Series C funding, 300% YoY growth, Featured in TechCrunch 2023..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y min-h-[80px]"
                maxLength={5000}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">Add key stats, studies, or data to make your carousel more credible</p>
                <p className="text-sm text-gray-500">{sources.length}/5000</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Content format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setContentFormat('paragraph')}
                  className={`py-4 px-4 rounded-lg transition-all text-left ${
                    contentFormat === 'paragraph'
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold mb-1">Paragraph</div>
                  <div className={`text-xs ${contentFormat === 'paragraph' ? 'text-white/90' : 'text-gray-500'}`}>
                    Fluid prose text, 4-5 lines
                  </div>
                </button>
                <button
                  onClick={() => setContentFormat('bullets')}
                  className={`py-4 px-4 rounded-lg transition-all text-left ${
                    contentFormat === 'bullets'
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold mb-1">Bullets</div>
                  <div className={`text-xs ${contentFormat === 'bullets' ? 'text-white/90' : 'text-gray-500'}`}>
                    Quote/stat + 3-4 bullet points
                  </div>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ChevronDown
                  size={20}
                  className={`transform transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`}
                />
                View more settings
              </button>

              {showAdvancedSettings && (
                <div className="mt-6 space-y-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Content length
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      <button
                        onClick={() => setContentLength('short')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          contentLength === 'short'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Short
                      </button>
                      <button
                        onClick={() => setContentLength('medium')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          contentLength === 'medium'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => setContentLength('long')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          contentLength === 'long'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Long
                      </button>
                      <button
                        onClick={() => setContentLength('auto')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          contentLength === 'auto'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Auto
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Language
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {languages.map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => setLanguage(lang.value as CarouselLanguage)}
                          className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                            language === lang.value
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Number of slides
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {[5, 10, 15].map((count) => (
                        <button
                          key={count}
                          onClick={() => handleSlideCountClick(count)}
                          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                            slideCount === count && slideMode === 'fixed'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                      <button
                        onClick={handleAutoClick}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          slideMode === 'auto'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Auto
                      </button>
                      <button
                        onClick={handleCustomClick}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          slideMode === 'custom'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Custom
                      </button>
                    </div>
                    {slideMode === 'custom' && (
                      <div className="mt-3">
                        <input
                          type="number"
                          min="3"
                          max="20"
                          value={customSlideCount}
                          onChange={(e) => setCustomSlideCount(e.target.value)}
                          placeholder="Enter number (3-20)"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {slideMode === 'auto'
                        ? 'AI will determine the optimal number of slides'
                        : slideMode === 'custom'
                        ? 'Enter a custom number between 3 and 20'
                        : `Fixed ${slideCount}-slide carousel`}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Design Preferences</h3>
                    <p className="text-sm text-gray-600 mb-4">Customize how your carousel will look</p>

                    <div className="grid grid-cols-3 gap-4">
                      <PreviewCard
                        title="Cover"
                        description="First page design"
                        preview={
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                            <div className={`w-3/4 h-3 rounded mb-2 ${coverAlignment === 'start' ? 'mr-auto' : 'mx-auto'}`} style={{ backgroundColor: primaryColor }} />
                            <div className={`w-1/2 h-2 bg-gray-400 rounded ${coverAlignment === 'start' ? 'mr-auto' : 'mx-auto'}`} />
                            {signaturePosition && (
                              <div className={`absolute bottom-4 ${signaturePosition === 'bottom-right' ? 'right-4' : 'left-4'} w-6 h-1.5 bg-gray-500 rounded`} />
                            )}
                          </div>
                        }
                        onCustomize={() => setCustomizeModalOpen('cover')}
                      />

                      <PreviewCard
                        title="Content"
                        description="Main slides style"
                        preview={
                          contentStyle === 'split' ? (
                            <div className="absolute inset-0 flex flex-col gap-2 p-4">
                              <div className="flex-1 bg-white rounded flex items-center justify-center">
                                <div className="w-2/3 h-3 rounded" style={{ backgroundColor: primaryColor }} />
                              </div>
                              <div className="flex-1 bg-white rounded flex flex-col justify-center px-3 gap-1">
                                <div className="w-full h-1.5 bg-gray-400 rounded" />
                                <div className="w-4/5 h-1.5 bg-gray-400 rounded" />
                                <div className="w-full h-1.5 bg-gray-400 rounded" />
                              </div>
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex flex-col justify-center p-4 gap-2">
                              <div className={`h-3 rounded ${contentAlignment === 'start' ? 'w-2/3' : 'w-2/3 mx-auto'}`} style={{ backgroundColor: primaryColor }} />
                              <div className="space-y-1">
                                <div className={`h-1.5 bg-gray-400 rounded ${contentAlignment === 'start' ? 'w-full' : 'w-full mx-auto'}`} />
                                <div className={`h-1.5 bg-gray-400 rounded ${contentAlignment === 'start' ? 'w-4/5' : 'w-4/5 mx-auto'}`} />
                                <div className={`h-1.5 bg-gray-400 rounded ${contentAlignment === 'start' ? 'w-full' : 'w-full mx-auto'}`} />
                              </div>
                            </div>
                          )
                        }
                        onCustomize={() => setCustomizeModalOpen('content')}
                      />

                      <PreviewCard
                        title="End Page"
                        description="Last page design"
                        preview={
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-2">
                            <div className="w-12 h-12 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.3 }} />
                            <div className="w-2/3 h-3 rounded" style={{ backgroundColor: primaryColor }} />
                            <div className="w-1/2 h-2 bg-gray-400 rounded" />
                          </div>
                        }
                        onCustomize={() => navigate('/settings')}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={subject.trim().length < 3}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles size={24} />
              Redact my content now
            </button>
          </div>
        </div>
      </div>

      <CustomizeModal
        isOpen={customizeModalOpen !== null}
        onClose={() => setCustomizeModalOpen(null)}
        type={customizeModalOpen || 'cover'}
        coverAlignment={coverAlignment}
        signaturePosition={signaturePosition}
        contentStyle={contentStyle}
        showSlideNumbers={showSlideNumbers}
        contentAlignment={contentAlignment}
        primaryColor={primaryColor}
        onUpdateCoverAlignment={setCoverAlignment}
        onUpdateSignaturePosition={setSignaturePosition}
        onUpdateContentStyle={setContentStyle}
        onUpdateShowSlideNumbers={setShowSlideNumbers}
        onUpdateContentAlignment={setContentAlignment}
      />
    </div>
  );
}
