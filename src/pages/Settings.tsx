import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Crown } from 'lucide-react';
import { hasActiveSubscription } from '../services/subscription';
import { PaymentModal } from '../components/PaymentModal';
import { getOrCreateUserSettings, updateUserSettings } from '../services/settings';
import { SettingsFormData, CoverAlignment, SignaturePosition, ContentStyle, ContentAlignment } from '../types/settings';
import { getCurrentUserId } from '../services/user';
import { CustomizeModal } from '../components/CustomizeModal';
import { PreviewCard } from '../components/PreviewCard';

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customizeModalOpen, setCustomizeModalOpen] = useState<'cover' | 'content' | 'end' | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [formData, setFormData] = useState<SettingsFormData>({
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
    show_premium_banner: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      const [settings, premium] = await Promise.all([
        getOrCreateUserSettings(userId),
        hasActiveSubscription(userId)
      ]);

      setIsPremium(premium);
      setFormData({
        primary_color: settings.primary_color,
        show_signature: settings.show_signature,
        signature_name: settings.signature_name,
        cover_alignment: settings.cover_alignment,
        signature_position: settings.signature_position,
        content_style: settings.content_style,
        show_slide_numbers: settings.show_slide_numbers,
        content_alignment: settings.content_alignment,
        end_page_title: settings.end_page_title,
        end_page_subtitle: settings.end_page_subtitle,
        end_page_cta: settings.end_page_cta,
        end_page_contact: settings.end_page_contact,
        end_page_image: settings.end_page_image || '',
        show_premium_banner: settings.show_premium_banner
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUserSettings(getCurrentUserId(), formData);
      navigate('/');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateColor = (color: string) => {
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      setFormData({ ...formData, primary_color: color });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="text-gray-400 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {!isPremium && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown size={20} className="text-yellow-400" />
                      <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wide">Premium</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Unlock Full Customization
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Get unlimited carousels, remove watermarks, and access advanced customization options
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-white">$24</span>
                      <span className="text-gray-400 text-sm">lifetime access</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-lg whitespace-nowrap"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Design Preferences</h2>
            <p className="text-sm text-gray-600 mb-6">Customize the layout and style of your carousel slides</p>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand Color</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formData.primary_color}
                  onChange={(e) => updateColor(e.target.value.toUpperCase())}
                  placeholder="#0A66C2"
                  maxLength={7}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono text-sm"
                />
                <input
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value.toUpperCase() })}
                  className="w-14 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <PreviewCard
                title="Cover"
                description="First page design"
                preview={
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <div className={`w-3/4 h-3 rounded mb-2 ${formData.cover_alignment === 'start' ? 'mr-auto' : 'mx-auto'}`} style={{ backgroundColor: formData.primary_color }} />
                    <div className={`w-1/2 h-2 bg-gray-400 rounded ${formData.cover_alignment === 'start' ? 'mr-auto' : 'mx-auto'}`} />
                    {formData.signature_position && (
                      <div className={`absolute bottom-4 ${formData.signature_position === 'bottom-right' ? 'right-4' : 'left-4'} w-6 h-1.5 bg-gray-500 rounded`} />
                    )}
                  </div>
                }
                onCustomize={() => setCustomizeModalOpen('cover')}
              />

              <PreviewCard
                title="Content"
                description="Main slides style"
                preview={
                  formData.content_style === 'split' ? (
                    <div className="absolute inset-0 flex flex-col gap-2 p-4">
                      <div className="flex-1 bg-white rounded flex items-center justify-center">
                        <div className="w-2/3 h-3 rounded" style={{ backgroundColor: formData.primary_color }} />
                      </div>
                      <div className="flex-1 bg-white rounded flex flex-col justify-center px-3 gap-1">
                        <div className="w-full h-1.5 bg-gray-400 rounded" />
                        <div className="w-4/5 h-1.5 bg-gray-400 rounded" />
                        <div className="w-full h-1.5 bg-gray-400 rounded" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col justify-center p-4 gap-2">
                      <div className={`h-3 rounded ${formData.content_alignment === 'start' ? 'w-2/3' : 'w-2/3 mx-auto'}`} style={{ backgroundColor: formData.primary_color }} />
                      <div className="space-y-1">
                        <div className={`h-1.5 bg-gray-400 rounded ${formData.content_alignment === 'start' ? 'w-full' : 'w-full mx-auto'}`} />
                        <div className={`h-1.5 bg-gray-400 rounded ${formData.content_alignment === 'start' ? 'w-4/5' : 'w-4/5 mx-auto'}`} />
                        <div className={`h-1.5 bg-gray-400 rounded ${formData.content_alignment === 'start' ? 'w-full' : 'w-full mx-auto'}`} />
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
                    {formData.end_page_image ? (
                      <img src={formData.end_page_image} alt="" className="w-12 h-12 rounded-full object-cover" style={{ border: `2px solid ${formData.primary_color}` }} />
                    ) : (
                      <div className="w-12 h-12 rounded-full" style={{ backgroundColor: formData.primary_color, opacity: 0.3 }} />
                    )}
                    <div className="w-2/3 h-3 rounded" style={{ backgroundColor: formData.primary_color }} />
                    <div className="w-1/2 h-2 bg-gray-400 rounded" />
                  </div>
                }
                onCustomize={() => setCustomizeModalOpen('end')}
              />
            </div>
          </div>

        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setShowPaymentModal(false);
          loadSettings();
        }}
      />

      <CustomizeModal
        isOpen={customizeModalOpen !== null}
        onClose={() => setCustomizeModalOpen(null)}
        type={customizeModalOpen || 'cover'}
        coverAlignment={formData.cover_alignment}
        signaturePosition={formData.signature_position}
        showSignature={formData.show_signature}
        signatureName={formData.signature_name}
        contentStyle={formData.content_style}
        showSlideNumbers={formData.show_slide_numbers}
        contentAlignment={formData.content_alignment}
        primaryColor={formData.primary_color}
        endPageTitle={formData.end_page_title}
        endPageSubtitle={formData.end_page_subtitle}
        endPageContact={formData.end_page_contact}
        endPageImage={formData.end_page_image}
        onUpdateCoverAlignment={(value) => setFormData({ ...formData, cover_alignment: value })}
        onUpdateSignaturePosition={(value) => setFormData({ ...formData, signature_position: value })}
        onUpdateShowSignature={(value) => setFormData({ ...formData, show_signature: value })}
        onUpdateSignatureName={(value) => setFormData({ ...formData, signature_name: value })}
        onUpdateContentStyle={(value) => setFormData({ ...formData, content_style: value })}
        onUpdateShowSlideNumbers={(value) => setFormData({ ...formData, show_slide_numbers: value })}
        onUpdateContentAlignment={(value) => setFormData({ ...formData, content_alignment: value })}
        onUpdateEndPageTitle={(value) => setFormData({ ...formData, end_page_title: value })}
        onUpdateEndPageSubtitle={(value) => setFormData({ ...formData, end_page_subtitle: value })}
        onUpdateEndPageContact={(value) => setFormData({ ...formData, end_page_contact: value })}
        onUpdateEndPageImage={(value) => setFormData({ ...formData, end_page_image: value })}
      />
    </div>
  );
}
