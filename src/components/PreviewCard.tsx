import { Settings } from 'lucide-react';

interface PreviewCardProps {
  title: string;
  description: string;
  preview: React.ReactNode;
  onCustomize: () => void;
}

export function PreviewCard({ title, description, preview, onCustomize }: PreviewCardProps) {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:border-gray-300 transition-all">
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {preview}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <button
          onClick={onCustomize}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Settings size={18} />
          Customize
        </button>
      </div>
    </div>
  );
}
