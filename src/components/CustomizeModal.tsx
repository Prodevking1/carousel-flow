import { X } from 'lucide-react';
import { CoverAlignment, SignaturePosition, ContentStyle, ContentAlignment } from '../types/settings';
import { DesignPreview } from './DesignPreview';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'cover' | 'content' | 'end';
  coverAlignment: CoverAlignment;
  signaturePosition: SignaturePosition;
  showSignature: boolean;
  signatureName: string;
  coverTitle?: string;
  coverSubtitle?: string;
  contentStyle: ContentStyle;
  showSlideNumbers: boolean;
  contentAlignment: ContentAlignment;
  primaryColor: string;
  endPageTitle?: string;
  endPageSubtitle?: string;
  endPageContact?: string;
  endPageImage?: string;
  onUpdateCoverAlignment: (value: CoverAlignment) => void;
  onUpdateSignaturePosition: (value: SignaturePosition) => void;
  onUpdateShowSignature: (value: boolean) => void;
  onUpdateSignatureName: (value: string) => void;
  onUpdateCoverTitle?: (value: string) => void;
  onUpdateCoverSubtitle?: (value: string) => void;
  onUpdateContentStyle: (value: ContentStyle) => void;
  onUpdateShowSlideNumbers: (value: boolean) => void;
  onUpdateContentAlignment: (value: ContentAlignment) => void;
  onUpdateEndPageTitle?: (value: string) => void;
  onUpdateEndPageSubtitle?: (value: string) => void;
  onUpdateEndPageContact?: (value: string) => void;
  onUpdateEndPageImage?: (value: string) => void;
}

export function CustomizeModal({
  isOpen,
  onClose,
  type,
  coverAlignment,
  signaturePosition,
  showSignature,
  signatureName,
  coverTitle = '',
  coverSubtitle = '',
  contentStyle,
  showSlideNumbers,
  contentAlignment,
  primaryColor,
  endPageTitle = '',
  endPageSubtitle = '',
  endPageContact = '',
  endPageImage = '',
  onUpdateCoverAlignment,
  onUpdateSignaturePosition,
  onUpdateShowSignature,
  onUpdateSignatureName,
  onUpdateCoverTitle,
  onUpdateCoverSubtitle,
  onUpdateContentStyle,
  onUpdateShowSlideNumbers,
  onUpdateContentAlignment,
  onUpdateEndPageTitle,
  onUpdateEndPageSubtitle,
  onUpdateEndPageContact,
  onUpdateEndPageImage
}: CustomizeModalProps) {
  if (!isOpen) return null;

  const renderCoverOptions = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <div
          className={`relative aspect-square bg-white rounded-lg shadow-lg flex flex-col p-8 gap-4 ${coverAlignment === 'start' ? 'items-start' : 'items-center'}`}
          style={{ background: `linear-gradient(135deg, ${primaryColor}10 0%, ${primaryColor}05 100%)` }}
        >
          <div className={`flex-1 flex flex-col ${coverAlignment === 'start' ? 'items-start' : 'items-center'} justify-center gap-4 w-full ${coverAlignment === 'start' ? 'text-left' : 'text-center'}`}>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {coverTitle || 'How to Build a Successful Content Strategy in 2024'}
            </h1>
            <p className="text-lg text-gray-600">
              {coverSubtitle || 'A step-by-step guide to creating engaging content'}
            </p>
          </div>
          {showSignature && signaturePosition && (
            <div className={`absolute bottom-6 ${signaturePosition === 'bottom-right' ? 'right-6' : 'left-6'}`}>
              <div className="text-sm font-medium text-gray-500">{signatureName || 'Your Name'}</div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
          <input
            type="text"
            value={coverTitle}
            onChange={(e) => onUpdateCoverTitle?.(e.target.value)}
            placeholder="How to Build a Successful Content Strategy in 2024"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Subtitle</label>
          <input
            type="text"
            value={coverSubtitle}
            onChange={(e) => onUpdateCoverSubtitle?.(e.target.value)}
            placeholder="A step-by-step guide to creating engaging content"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Page Layout
          </label>
          <div className="grid grid-cols-2 gap-4">
            <DesignPreview
              type="cover"
              variant="centered"
              selected={coverAlignment === 'centered'}
              onClick={() => onUpdateCoverAlignment('centered')}
              label="Centered"
              primaryColor={primaryColor}
            />
            <DesignPreview
              type="cover"
              variant="start"
              selected={coverAlignment === 'start'}
              onClick={() => onUpdateCoverAlignment('start')}
              label="Left aligned"
              primaryColor={primaryColor}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              id="showSignature"
              checked={showSignature}
              onChange={(e) => onUpdateShowSignature(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="showSignature" className="text-sm font-semibold text-gray-900">
              Show signature
            </label>
          </div>

          {showSignature && (
            <div className="space-y-4 pl-7">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Signature name</label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => onUpdateSignatureName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Signature position</label>
                <div className="grid grid-cols-2 gap-4">
                  <DesignPreview
                    type="cover"
                    variant="bottom-right"
                    selected={signaturePosition === 'bottom-right'}
                    onClick={() => onUpdateSignaturePosition('bottom-right')}
                    label="Bottom right"
                    primaryColor={primaryColor}
                  />
                  <DesignPreview
                    type="cover"
                    variant="bottom-left"
                    selected={signaturePosition === 'bottom-left'}
                    onClick={() => onUpdateSignaturePosition('bottom-left')}
                    label="Bottom left"
                    primaryColor={primaryColor}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContentOptions = () => {
    const accentColor = primaryColor + '40';

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          {contentStyle === 'split' ? (
            <div className="aspect-square bg-white rounded-lg shadow-lg flex flex-col">
              <div className="flex-1 flex items-center justify-center p-6" style={{ backgroundColor: primaryColor }}>
                <div className="text-center">
                  {showSlideNumbers && (
                    <div className="text-sm font-bold text-white mb-2 opacity-80">1</div>
                  )}
                  <h2 className="text-3xl font-bold text-white">Key Point Title</h2>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center p-8 gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: primaryColor }}></div>
                  <p className="text-gray-700 flex-1">First important detail about this topic</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: primaryColor }}></div>
                  <p className="text-gray-700 flex-1">Second key insight to remember</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: primaryColor }}></div>
                  <p className="text-gray-700 flex-1">Third crucial takeaway</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`aspect-square bg-white rounded-lg shadow-lg flex flex-col justify-center p-8 gap-6 ${contentAlignment === 'start' ? 'items-start text-left' : 'items-center text-center'}`}
            >
              <h2 className="text-3xl font-bold text-gray-900">Key Point Title</h2>
              <div className="space-y-3 w-full">
                <div className={`flex items-start gap-3 ${contentAlignment === 'start' ? '' : 'justify-center'}`}>
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: primaryColor }}></div>
                  <p className="text-gray-700">First important detail about this topic</p>
                </div>
                <div className={`flex items-start gap-3 ${contentAlignment === 'start' ? '' : 'justify-center'}`}>
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: primaryColor }}></div>
                  <p className="text-gray-700">Second key insight to remember</p>
                </div>
                <div className={`flex items-start gap-3 ${contentAlignment === 'start' ? '' : 'justify-center'}`}>
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: primaryColor }}></div>
                  <p className="text-gray-700">Third crucial takeaway</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Slide Style
            </label>
            <div className="grid grid-cols-2 gap-4">
              <DesignPreview
                type="content"
                variant="split"
                selected={contentStyle === 'split'}
                onClick={() => onUpdateContentStyle('split')}
                label="Split (Title + Content)"
                primaryColor={primaryColor}
              />
              <DesignPreview
                type="content"
                variant="combined"
                selected={contentStyle === 'combined'}
                onClick={() => onUpdateContentStyle('combined')}
                label="Combined"
                primaryColor={primaryColor}
              />
            </div>

            {contentStyle === 'split' && (
              <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="showSlideNumbers"
                  checked={showSlideNumbers}
                  onChange={(e) => onUpdateShowSlideNumbers(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="showSlideNumbers" className="text-sm text-gray-700">
                  Show slide numbers on title slides
                </label>
              </div>
            )}

            {contentStyle === 'combined' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content alignment
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <DesignPreview
                    type="content"
                    variant="centered"
                    selected={contentAlignment === 'centered'}
                    onClick={() => onUpdateContentAlignment('centered')}
                    label="Centered"
                    primaryColor={primaryColor}
                  />
                  <DesignPreview
                    type="content"
                    variant="start"
                    selected={contentAlignment === 'start'}
                    onClick={() => onUpdateContentAlignment('start')}
                    label="Left aligned"
                    primaryColor={primaryColor}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateEndPageImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateEndPageImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    if (onUpdateEndPageImage) {
      onUpdateEndPageImage('');
    }
  };

  const renderEndOptions = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <div className="aspect-square bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-8 gap-4">
          {endPageImage ? (
            <img
              src={endPageImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
              style={{ border: `4px solid ${primaryColor}` }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: primaryColor, opacity: 0.2 }}
            >
              <svg className="w-12 h-12" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {endPageTitle || 'Your Name'}
          </h2>

          <p className="text-lg text-gray-600 text-center">
            {endPageSubtitle || 'Follow me for more content'}
          </p>

          {endPageContact && (
            <p className="text-sm text-gray-500 text-center mt-2">
              {endPageContact}
            </p>
          )}

          <button
            className="mt-4 px-8 py-3 rounded-lg font-semibold text-white transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            Follow
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Profile Image</label>
          {endPageImage ? (
            <div className="flex items-center gap-4">
              <img
                src={endPageImage}
                alt="Profile preview"
                className="w-16 h-16 rounded-full object-cover"
                style={{ border: `3px solid ${primaryColor}` }}
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
            <label className="cursor-pointer block">
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
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Title (Your Name)</label>
          <input
            type="text"
            value={endPageTitle}
            onChange={(e) => onUpdateEndPageTitle?.(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Subtitle (Call to Action)</label>
          <input
            type="text"
            value={endPageSubtitle}
            onChange={(e) => onUpdateEndPageSubtitle?.(e.target.value)}
            placeholder="Follow me for more content"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Contact (Optional)</label>
          <input
            type="text"
            value={endPageContact}
            onChange={(e) => onUpdateEndPageContact?.(e.target.value)}
            placeholder="contact@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>
      </div>
    </div>
  );

  const titles = {
    cover: 'Customize Cover Page',
    content: 'Customize Content Slides',
    end: 'Customize End Page'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{titles[type]}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {type === 'cover' && renderCoverOptions()}
          {type === 'content' && renderContentOptions()}
          {type === 'end' && renderEndOptions()}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
