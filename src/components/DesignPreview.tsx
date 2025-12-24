import { CoverAlignment, SignaturePosition, ContentStyle, ContentAlignment } from '../types/settings';

interface DesignPreviewProps {
  type: 'cover' | 'content';
  variant: string;
  selected: boolean;
  onClick: () => void;
  label: string;
  primaryColor?: string;
}

export function DesignPreview({ type, variant, selected, onClick, label, primaryColor = '#0A66C2' }: DesignPreviewProps) {
  if (type === 'cover') {
    const alignment = variant.split('-')[0] as CoverAlignment;
    const signaturePos = variant as SignaturePosition;

    if (variant === 'centered' || variant === 'start') {
      return (
        <button
          onClick={onClick}
          className={`relative border-2 rounded-lg p-4 transition-all ${
            selected
              ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center p-3">
            <div
              className={`w-full ${
                alignment === 'centered' ? 'flex flex-col items-center justify-center' : 'flex flex-col items-start justify-center'
              }`}
            >
              <div className="w-3/4 h-2 rounded mb-2" style={{ backgroundColor: primaryColor }} />
              <div className={`w-1/2 h-1.5 bg-gray-400 rounded ${alignment === 'centered' ? 'mx-auto' : ''}`} />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-700 mt-2 text-center">{label}</p>
        </button>
      );
    } else {
      const isRight = signaturePos === 'bottom-right';
      return (
        <button
          onClick={onClick}
          className={`relative border-2 rounded-lg p-4 transition-all ${
            selected
              ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center p-3 relative">
            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-3/4 h-2 rounded mb-2" style={{ backgroundColor: primaryColor }} />
              <div className="w-1/2 h-1.5 bg-gray-400 rounded" />
            </div>
            <div className={`absolute bottom-2 ${isRight ? 'right-2' : 'left-2'} w-4 h-1 bg-gray-500 rounded`} />
          </div>
          <p className="text-sm font-medium text-gray-700 mt-2 text-center">{label}</p>
        </button>
      );
    }
  }

  if (type === 'content') {
    const style = variant as ContentStyle | ContentAlignment;

    if (variant === 'split') {
      return (
        <button
          onClick={onClick}
          className={`relative border-2 rounded-lg p-4 transition-all ${
            selected
              ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="space-y-2">
            <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center p-3 relative">
              <div className="w-2/3 h-2 rounded" style={{ backgroundColor: primaryColor }} />
              <div className="absolute bottom-1 right-1 w-3 h-1 bg-gray-400 rounded text-[6px]" />
            </div>
            <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded flex flex-col justify-center p-3 gap-1">
              <div className="w-full h-1 bg-gray-400 rounded" />
              <div className="w-4/5 h-1 bg-gray-400 rounded" />
              <div className="w-full h-1 bg-gray-400 rounded" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-700 mt-2 text-center">{label}</p>
        </button>
      );
    }

    if (variant === 'combined') {
      return (
        <button
          onClick={onClick}
          className={`relative border-2 rounded-lg p-4 transition-all ${
            selected
              ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded flex flex-col justify-center p-3 gap-2">
            <div className="w-2/3 h-2 rounded mb-1" style={{ backgroundColor: primaryColor }} />
            <div className="space-y-1">
              <div className="w-full h-1 bg-gray-400 rounded" />
              <div className="w-4/5 h-1 bg-gray-400 rounded" />
              <div className="w-full h-1 bg-gray-400 rounded" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-700 mt-2 text-center">{label}</p>
        </button>
      );
    }

    const alignment = style as ContentAlignment;
    return (
      <button
        onClick={onClick}
        className={`relative border-2 rounded-lg p-4 transition-all ${
          selected
            ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2'
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded flex flex-col justify-center p-3 gap-2">
          <div className={`h-2 rounded mb-1 ${alignment === 'centered' ? 'w-2/3 mx-auto' : 'w-2/3'}`} style={{ backgroundColor: primaryColor }} />
          <div className="space-y-1">
            <div className={`h-1 bg-gray-400 rounded ${alignment === 'centered' ? 'w-full mx-auto' : 'w-full'}`} />
            <div className={`h-1 bg-gray-400 rounded ${alignment === 'centered' ? 'w-4/5 mx-auto' : 'w-4/5'}`} />
            <div className={`h-1 bg-gray-400 rounded ${alignment === 'centered' ? 'w-full mx-auto' : 'w-full'}`} />
          </div>
        </div>
        <p className="text-sm font-medium text-gray-700 mt-2 text-center">{label}</p>
      </button>
    );
  }

  return null;
}
