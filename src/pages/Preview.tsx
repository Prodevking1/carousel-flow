import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Edit2, RefreshCw, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Carousel, Slide } from '../types/carousel';
import { UserSettings } from '../types/settings';
import SlideRenderer from '../components/SlideRenderer';
import EditSlideModal from '../components/EditSlideModal';
import RegenerateModal from '../components/RegenerateModal';
import { PaymentModal } from '../components/PaymentModal';
import { exportToPDF } from '../services/pdf';
import { getOrCreateUserSettings } from '../services/settings';
import { useAuth } from '../contexts/AuthContext';
import { regenerateSlide } from '../services/ai';
import { hasActiveSubscription } from '../services/subscription';

export default function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [carousel, setCarousel] = useState<Carousel | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [exporting, setExporting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (id) {
      loadCarousel();
    }
  }, [id]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1);
      } else if (e.key === 'ArrowRight' && currentSlideIndex < slides.length - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlideIndex, slides.length]);

  const loadCarousel = async () => {
    if (!user?.id) return;
    try {
      const { data: carouselData, error: carouselError } = await supabase
        .from('carousels')
        .select('*')
        .eq('id', id)
        .single();

      if (carouselError) throw carouselError;

      const { data: slidesData, error: slidesError } = await supabase
        .from('slides')
        .select('*')
        .eq('carousel_id', id)
        .order('slide_number');

      if (slidesError) throw slidesError;

      const userSettings = await getOrCreateUserSettings(user.id);

      setCarousel(carouselData);
      setSlides(slidesData || []);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading carousel:', error);
      alert('Failed to load carousel');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSlide = async (updatedSlide: Slide) => {
    try {
      const { error } = await supabase
        .from('slides')
        .update({
          title: updatedSlide.title,
          subtitle: updatedSlide.subtitle,
          bullets: updatedSlide.bullets,
          stats: updatedSlide.stats,
          is_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedSlide.id);

      if (error) throw error;

      setSlides(slides.map(s => s.id === updatedSlide.id ? updatedSlide : s));
      setEditingSlide(null);
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Failed to save slide');
    }
  };

  const handleRegenerateSlide = async (guidance: string) => {
    if (!carousel || !currentSlide || regenerating) return;

    setRegenerating(true);
    try {
      const regeneratedSlide = await regenerateSlide(
        carousel,
        currentSlide,
        slides.length,
        guidance
      );

      const { error } = await supabase
        .from('slides')
        .update({
          title: regeneratedSlide.title,
          subtitle: regeneratedSlide.subtitle,
          bullets: regeneratedSlide.bullets,
          content: regeneratedSlide.content,
          stats: regeneratedSlide.stats,
          is_edited: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSlide.id);

      if (error) throw error;

      setSlides(slides.map(s =>
        s.id === currentSlide.id ? { ...currentSlide, ...regeneratedSlide } : s
      ));

      setShowRegenerateModal(false);
      alert('Slide regenerated successfully!');
    } catch (error) {
      console.error('Regeneration error:', error);
      alert('Failed to regenerate slide');
    } finally {
      setRegenerating(false);
    }
  };

  const handleExport = async () => {
    if (!carousel || slides.length === 0 || !user?.id) return;

    const hasSubscription = await hasActiveSubscription(user.id);

    if (!hasSubscription) {
      setShowPaymentModal(true);
      return;
    }

    setExporting(true);
    try {
      const pdfBlob = await exportToPDF(slides, slideRefs.current);

      const fileName = `carousel-${carousel.subject.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      await supabase
        .from('carousels')
        .update({ status: 'exported' })
        .eq('id', id);

      alert('PDF downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading carousel...</div>
      </div>
    );
  }

  if (!carousel || slides.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Carousel not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
            <h3 className="font-semibold text-gray-900 mb-4">Slides</h3>
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    index === currentSlideIndex
                      ? 'bg-primary/10 border border-primary text-gray-900'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Slide {slide.slide_number}: {slide.title.substring(0, 20)}
                      {slide.title.length > 20 ? '...' : ''}
                    </span>
                    {slide.is_edited && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Edited
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  {currentSlide.type === 'content' && (
                    <button
                      onClick={() => setShowRegenerateModal(true)}
                      disabled={regenerating}
                      className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary disabled:from-gray-400 disabled:to-gray-500 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 disabled:hover:scale-100"
                      title="Regenerate with AI"
                    >
                      {regenerating ? (
                        <RefreshCw size={20} className="animate-spin" />
                      ) : (
                        <Sparkles size={20} />
                      )}
                    </button>
                  )}
                  <div
                    ref={el => slideRefs.current[currentSlideIndex] = el}
                    className="border border-gray-300 rounded-lg overflow-hidden shadow-lg"
                  >
                    <SlideRenderer slide={currentSlide} totalSlides={slides.length} settings={settings || undefined} />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                    disabled={currentSlideIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg font-medium transition-colors"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {currentSlideIndex + 1} / {slides.length}
                    </div>
                    <div className="text-sm text-gray-600">Use arrow keys to navigate</div>
                  </div>

                  <button
                    onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                    disabled={currentSlideIndex === slides.length - 1}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg font-medium transition-colors"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setEditingSlide(currentSlide)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit2 size={20} />
                    Edit This Slide
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="flex-1 bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    {exporting ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden">
          {slides.map((slide, index) => (
            <div key={slide.id} ref={el => slideRefs.current[index] = el}>
              <SlideRenderer slide={slide} totalSlides={slides.length} settings={settings || undefined} />
            </div>
          ))}
        </div>
      </div>

      {editingSlide && (
        <EditSlideModal
          slide={editingSlide}
          onSave={handleSaveSlide}
          onClose={() => setEditingSlide(null)}
        />
      )}

      {showRegenerateModal && currentSlide && (
        <RegenerateModal
          slideNumber={currentSlide.slide_number}
          onRegenerate={handleRegenerateSlide}
          onClose={() => setShowRegenerateModal(false)}
          isRegenerating={regenerating}
        />
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </div>
  );
}
