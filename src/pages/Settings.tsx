import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Check } from 'lucide-react';
import { getOrCreateUserSettings, updateUserSettings } from '../services/settings';
import { SettingsFormData, DesignTemplate, CoverAlignment, SignaturePosition, ContentStyle, ContentAlignment } from '../types/settings';
import { getCurrentUserId } from '../services/user';
import { CustomizeModal } from '../components/CustomizeModal';
import { PreviewCard } from '../components/PreviewCard';

const PRESET_COLORS = [
  '#0A66C2', '#4ECDC4', '#45B7D1', '#F7B731', '#5F27CD',
  '#00D2D3', '#EE5A6F', '#2ECC71', '#E74C3C', '#9B59B6'
];

interface TemplatePreview {
  id: DesignTemplate;
  name: string;
  description: string;
}

const TEMPLATES: TemplatePreview[] = [
  { id: 'template1', name: 'Template 1', description: 'Titre et contenu séparés sur 2 pages' },
  { id: 'template2', name: 'Template 2', description: 'Titre et contenu dans la même page' }
];

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewTab, setPreviewTab] = useState<'cover' | 'content' | 'end'>('cover');
  const [expandedTemplate, setExpandedTemplate] = useState<DesignTemplate | null>('template1');
  const [customizeModalOpen, setCustomizeModalOpen] = useState<'cover' | 'content' | 'end' | null>(null);

  const [formData, setFormData] = useState<SettingsFormData>({
    primary_color: '#0A66C2',
    show_signature: false,
    signature_name: '',
    design_template: 'template1',
    cover_alignment: 'centered',
    signature_position: 'bottom-right',
    content_style: 'split',
    show_slide_numbers: true,
    content_alignment: 'centered',
    end_page_title: 'Your Name',
    end_page_subtitle: 'Follow me for more content',
    end_page_cta: 'Follow for more content',
    end_page_contact: '',
    end_page_image: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getOrCreateUserSettings(getCurrentUserId());
      setFormData({
        primary_color: settings.primary_color,
        show_signature: settings.show_signature,
        signature_name: settings.signature_name,
        design_template: settings.design_template || 'template1',
        cover_alignment: settings.cover_alignment,
        signature_position: settings.signature_position,
        content_style: settings.content_style,
        show_slide_numbers: settings.show_slide_numbers,
        content_alignment: settings.content_alignment,
        end_page_title: settings.end_page_title,
        end_page_subtitle: settings.end_page_subtitle,
        end_page_cta: settings.end_page_cta,
        end_page_contact: settings.end_page_contact,
        end_page_image: settings.end_page_image || ''
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, end_page_image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, end_page_image: '' });
  };

  const renderTemplateCover = (template: DesignTemplate, color: string, size: 'small' | 'large' = 'small') => {
    const isLarge = size === 'large';

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white p-8">
        <div className="text-center">
          <div className={`font-bold text-gray-900 mb-2 ${isLarge ? 'text-4xl' : 'text-lg'}`}>
            {isLarge ? 'Your Carousel Title' : 'Your Title'}
          </div>
          <div className={`text-gray-600 ${isLarge ? 'text-xl' : 'text-xs'}`}>
            {isLarge ? 'Engaging subtitle that captures attention' : 'Subtitle here'}
          </div>
          {formData.show_signature && formData.signature_name && isLarge && (
            <div className="absolute bottom-8 right-8 text-sm text-gray-700">
              {formData.signature_name}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTemplateContent = (template: DesignTemplate, color: string, size: 'small' | 'large' = 'small') => {
    const isLarge = size === 'large';
    const bullets = isLarge
      ? ['First key point with detailed explanation', 'Second important insight worth noting', 'Third valuable takeaway for readers']
      : ['Point 1', 'Point 2', 'Point 3'];

    if (template === 'template1') {
      return (
        <div className={`w-full h-full flex flex-col bg-white ${isLarge ? 'p-12' : 'p-3'}`}>
          <div className={`flex-1 ${isLarge ? 'space-y-6' : 'space-y-1.5'}`}>
            {bullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`font-bold ${isLarge ? 'text-2xl' : 'text-[10px]'}`} style={{ color }}>→</div>
                <div className={`text-gray-700 leading-relaxed ${isLarge ? 'text-lg' : 'text-[10px]'}`}>{bullet}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={`w-full h-full flex flex-col bg-white ${isLarge ? 'p-12' : 'p-3'}`}>
        <div className={`font-bold text-gray-900 mb-4 ${isLarge ? 'text-3xl' : 'text-xs'}`}>Content Slide</div>
        <div className={`flex-1 ${isLarge ? 'space-y-6' : 'space-y-1.5'}`}>
          {bullets.map((bullet, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`font-bold ${isLarge ? 'text-2xl' : 'text-[10px]'}`} style={{ color }}>→</div>
              <div className={`text-gray-700 leading-relaxed ${isLarge ? 'text-lg' : 'text-[10px]'}`}>{bullet}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTemplateEnd = (template: DesignTemplate, color: string, size: 'small' | 'large' = 'small') => {
    const isLarge = size === 'large';

    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-white ${isLarge ? 'p-12' : 'p-3'}`}>
        {formData.end_page_image && (
          <div className={`${isLarge ? 'mb-6' : 'mb-2'}`}>
            <img
              src={formData.end_page_image}
              alt="Profile"
              className={`rounded-full ${isLarge ? 'w-32 h-32' : 'w-12 h-12'}`}
              style={{ border: `${isLarge ? '4' : '2'}px solid ${color}` }}
            />
          </div>
        )}
        <div className={`font-bold text-gray-900 mb-3 ${isLarge ? 'text-5xl' : 'text-sm'}`}>{formData.end_page_title}</div>
        <div className={`text-gray-600 mb-6 text-center ${isLarge ? 'text-2xl max-w-lg' : 'text-[9px]'}`}>{formData.end_page_subtitle}</div>
        {formData.end_page_contact && isLarge && (
          <div className="mt-4 text-base text-gray-700">{formData.end_page_contact}</div>
        )}
      </div>
    );
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
            <p className="text-sm text-gray-600 mb-6">Select the design template that will be used to generate your carousels</p>
            <div className="space-y-4">
              {TEMPLATES.map((template) => {
                const isExpanded = expandedTemplate === template.id;
                const isSelected = formData.design_template === template.id;

                return (
                  <div
                    key={template.id}
                    className={`border-2 rounded-xl transition-all ${
                      isSelected
                        ? 'border-gray-900 shadow-md'
                        : 'border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setExpandedTemplate(isExpanded ? null : template.id);
                        setFormData({ ...formData, design_template: template.id });
                      }}
                      className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl"
                    >
                      <div>
                        <div className="font-bold text-gray-900 text-lg mb-1">{template.name}</div>
                        <div className="text-sm text-gray-600">{template.description}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isSelected && (
                          <div className="bg-gray-900 text-white rounded-full p-1.5">
                            <Check size={16} />
                          </div>
                        )}
                        <div className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs font-medium text-gray-600 mb-2">Cover</div>
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                              {renderTemplateCover(template.id, formData.primary_color)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-600 mb-2">Content</div>
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                              {renderTemplateContent(template.id, formData.primary_color)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-600 mb-2">End Page</div>
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                              {renderTemplateEnd(template.id, formData.primary_color)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Brand Color</h2>
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Signature</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_signature}
                  onChange={(e) => setFormData({ ...formData, show_signature: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show signature on cover page
                </span>
              </label>

              {formData.show_signature && (
                <input
                  type="text"
                  value={formData.signature_name}
                  onChange={(e) => setFormData({ ...formData, signature_name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Design Preferences</h2>
            <p className="text-sm text-gray-600 mb-6">Customize the layout and style of your carousel slides</p>

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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">End Page Content</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                {formData.end_page_image ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={formData.end_page_image}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover"
                      style={{ border: `3px solid ${formData.primary_color}` }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-600">Click to upload image</span>
                          <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (Your Name)</label>
                <input
                  type="text"
                  value={formData.end_page_title}
                  onChange={(e) => setFormData({ ...formData, end_page_title: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (Call to Action)</label>
                <input
                  type="text"
                  value={formData.end_page_subtitle}
                  onChange={(e) => setFormData({ ...formData, end_page_subtitle: e.target.value })}
                  placeholder="Follow me for more content"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact (Optional)</label>
                <input
                  type="text"
                  value={formData.end_page_contact}
                  onChange={(e) => setFormData({ ...formData, end_page_contact: e.target.value })}
                  placeholder="contact@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Preview</h2>
            <p className="text-sm text-gray-600 mb-6">See how your selected design will look</p>

            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setPreviewTab('cover')}
                className={`px-4 py-2 font-medium transition-colors ${
                  previewTab === 'cover'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cover
              </button>
              <button
                onClick={() => setPreviewTab('content')}
                className={`px-4 py-2 font-medium transition-colors ${
                  previewTab === 'content'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setPreviewTab('end')}
                className={`px-4 py-2 font-medium transition-colors ${
                  previewTab === 'end'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                End Page
              </button>
            </div>

            <div className="max-w-lg mx-auto">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-xl border-2 border-gray-300">
                {previewTab === 'cover' && renderTemplateCover(formData.design_template, formData.primary_color, 'large')}
                {previewTab === 'content' && renderTemplateContent(formData.design_template, formData.primary_color, 'large')}
                {previewTab === 'end' && renderTemplateEnd(formData.design_template, formData.primary_color, 'large')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomizeModal
        isOpen={customizeModalOpen !== null}
        onClose={() => setCustomizeModalOpen(null)}
        type={customizeModalOpen || 'cover'}
        coverAlignment={formData.cover_alignment}
        signaturePosition={formData.signature_position}
        contentStyle={formData.content_style}
        showSlideNumbers={formData.show_slide_numbers}
        contentAlignment={formData.content_alignment}
        primaryColor={formData.primary_color}
        onUpdateCoverAlignment={(value) => setFormData({ ...formData, cover_alignment: value })}
        onUpdateSignaturePosition={(value) => setFormData({ ...formData, signature_position: value })}
        onUpdateContentStyle={(value) => setFormData({ ...formData, content_style: value })}
        onUpdateShowSlideNumbers={(value) => setFormData({ ...formData, show_slide_numbers: value })}
        onUpdateContentAlignment={(value) => setFormData({ ...formData, content_alignment: value })}
      />
    </div>
  );
}
