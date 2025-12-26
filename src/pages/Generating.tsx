import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { generateCarouselContent } from '../services/ai';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface LocationState {
  subject: string;
  sources?: string;
  slideCount: number;
  language: 'fr' | 'en';
  contentFormat: 'bullets' | 'paragraph';
  contentLength: 'short' | 'medium' | 'long' | 'auto';
  contentStyle: 'split' | 'unified';
}

const stages = [
  { key: 'analyzing', label: 'Analyzing subject' },
  { key: 'researching', label: 'Researching insights' },
  { key: 'structuring', label: 'Structuring content' },
  { key: 'generating', label: 'Generating slides' },
  { key: 'visualizing', label: 'Creating visuals' }
];

export default function Generating() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as LocationState;

  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState('');
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    if (!state?.subject) {
      navigate('/generate');
      return;
    }

    if (!hasGeneratedRef.current) {
      hasGeneratedRef.current = true;
      generateCarousel();
    }
  }, []);

  const generateCarousel = async () => {
    if (!user?.id) {
      setError('You must be logged in to generate a carousel');
      return;
    }

    try {
      const content = await generateCarouselContent(
        state.subject,
        state.slideCount,
        state.language,
        state.contentFormat,
        state.contentLength || 'auto',
        state.contentStyle || 'split',
        state.sources,
        (prog, message) => {
          setProgress(prog);
          const stageIndex = Math.floor((prog / 100) * stages.length);
          setCurrentStage(Math.min(stageIndex, stages.length - 1));
        }
      );

      const { data: carousel, error: carouselError } = await supabase
        .from('carousels')
        .insert({
          title: content.title,
          subject: state.subject,
          slide_count: content.slides.length,
          language: state.language,
          content_format: state.contentFormat,
          hashtags: content.hashtags,
          status: 'draft',
          user_id: user.id
        })
        .select()
        .single();

      if (carouselError) throw carouselError;

      const slidesData = content.slides.map(slide => ({
        ...slide,
        carousel_id: carousel.id
      }));

      const { error: slidesError } = await supabase
        .from('slides')
        .insert(slidesData);

      if (slidesError) throw slidesError;

      navigate(`/preview/${carousel.id}`);
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate carousel. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😕</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Generation Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/generate')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="text-primary animate-spin" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Carousel</h2>
          <p className="text-gray-600">
            Creating {state.slideCount === 'auto' ? 'optimized' : state.slideCount} slides about {state.subject}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {stages.map((stage, index) => (
            <div key={stage.key} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                index < currentStage
                  ? 'bg-green-500'
                  : index === currentStage
                  ? 'bg-primary'
                  : 'bg-gray-200'
              }`}>
                {index < currentStage ? (
                  <Check size={16} className="text-white" />
                ) : index === currentStage ? (
                  <Loader2 size={16} className="text-white animate-spin" />
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                )}
              </div>
              <span className={`text-sm ${
                index <= currentStage ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}>
                {stage.label}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-start text-sm text-gray-500 mt-4">
          Estimated time: {Math.max(1, Math.ceil((100 - progress) / 5))} seconds
        </p>
      </div>
    </div>
  );
}
