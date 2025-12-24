import { X } from 'lucide-react';
import { CoverAlignment, SignaturePosition, ContentStyle, ContentAlignment } from '../types/settings';
import { DesignPreview } from './DesignPreview';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'cover' | 'content' | 'end';
  coverAlignment: CoverAlignment;
  signaturePosition: SignaturePosition;
  contentStyle: ContentStyle;
  showSlideNumbers: boolean;
  contentAlignment: ContentAlignment;
  primaryColor: string;
  onUpdateCoverAlignment: (value: CoverAlignment) => void;
  onUpdateSignaturePosition: (value: SignaturePosition) => void;
  onUpdateContentStyle: (value: ContentStyle) => void;
  onUpdateShowSlideNumbers: (value: boolean) => void;
  onUpdateContentAlignment: (value: ContentAlignment) => void;
}

export function CustomizeModal({
  isOpen,
  onClose,
  type,
  coverAlignment,
  signaturePosition,
  contentStyle,
  showSlideNumbers,
  contentAlignment,
  primaryColor,
  onUpdateCoverAlignment,
  onUpdateSignaturePosition,
  onUpdateContentStyle,
  onUpdateShowSlideNumbers,
  onUpdateContentAlignment
}: CustomizeModalProps) {
  if (!isOpen) return null;

  const renderCoverOptions = () => (
    <div className="space-y-6">
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
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Signature Position
        </label>
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
  );

  const renderContentOptions = () => (
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
  );

  const renderEndOptions = () => (
    <div className="text-center py-8 text-gray-600">
      End page customization is available in Settings
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
