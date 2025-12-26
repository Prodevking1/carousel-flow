import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Download, Eye, Settings, Zap, Clock, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Carousel } from '../types/carousel';

export default function Dashboard() {
  const navigate = useNavigate();
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFomoBanner, setShowFomoBanner] = useState(true);

  useEffect(() => {
    loadCarousels();
  }, []);

  const loadCarousels = async () => {
    try {
      const { data, error } = await supabase
        .from('carousels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCarousels(data || []);
    } catch (error) {
      console.error('Error loading carousels:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCarousel = async (id: string) => {
    if (!confirm('Delete this carousel?')) return;

    try {
      const { error: slidesError } = await supabase
        .from('slides')
        .delete()
        .eq('carousel_id', id);

      if (slidesError) throw slidesError;

      const { error } = await supabase
        .from('carousels')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCarousels(carousels.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting carousel:', error);
      alert('Failed to delete carousel');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Carousels</h1>
            <p className="text-gray-600 mt-1">Create and manage your LinkedIn carousels</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/settings')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Settings size={20} />
              Settings
            </button>
            <button
              onClick={() => navigate('/generate')}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              New Carousel
            </button>
          </div>
        </div>

        {showFomoBanner && (
          <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-lg shadow-lg p-4 mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <button
              onClick={() => setShowFomoBanner(false)}
              className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors z-10"
            >
              <X size={18} />
            </button>
            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex-1 min-w-[300px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={20} className="text-yellow-300" />
                    <span className="bg-yellow-300 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                      Limited Offer
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Unlock Premium for only $24
                  </h3>
                  <p className="text-white/90 text-xs mb-1">
                    Get unlimited carousels, advanced customization, and priority support
                  </p>
                  <div className="flex items-center gap-1.5 text-white/95">
                    <Clock size={14} />
                    <span className="text-xs font-semibold">Offer expires soon</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate('/settings')}
                    className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-2.5 rounded-lg font-bold transition-colors shadow-lg whitespace-nowrap"
                  >
                    Claim Offer Now
                  </button>
                  <p className="text-white/80 text-xs text-center">
                    One-time payment • Lifetime access
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {carousels.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No carousels yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first AI-generated LinkedIn carousel in just a few clicks
              </p>
              <button
                onClick={() => navigate('/generate')}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Create Your First Carousel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carousels.map((carousel) => (
              <div
                key={carousel.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{carousel.title}</h3>
                    <p className="text-gray-600">{carousel.slide_count} slides</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">{formatDate(carousel.created_at)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      carousel.status === 'exported'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {carousel.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/preview/${carousel.id}`)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    {carousel.pdf_url && (
                      <button
                        onClick={() => window.open(carousel.pdf_url, '_blank')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Download size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteCarousel(carousel.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
