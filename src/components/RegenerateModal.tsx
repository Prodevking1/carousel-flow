import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface RegenerateModalProps {
  slideNumber: number;
  onRegenerate: (guidance: string) => void;
  onClose: () => void;
  isRegenerating: boolean;
}

export default function RegenerateModal({ slideNumber, onRegenerate, onClose, isRegenerating }: RegenerateModalProps) {
  const [guidance, setGuidance] = useState('');

  const handleSubmit = () => {
    onRegenerate(guidance.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl max-w-lg w-full border border-primary/30">
        <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Regenerate Slide {slideNumber}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isRegenerating}
            className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Guide the AI (optional)
            </label>
            <textarea
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              placeholder="Example: Focus more on technical details, add statistics, make it more actionable..."
              className="w-full px-4 py-3 bg-gray-800 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              rows={4}
              maxLength={300}
              disabled={isRegenerating}
            />
            <div className="text-xs text-gray-500 mt-2 text-right">
              {guidance.length}/300
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary-light">
              The AI will regenerate this slide with fresh content. Add guidance to steer the direction, or leave empty for a complete refresh.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isRegenerating}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 border border-gray-700 text-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isRegenerating}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isRegenerating ? (
                <>
                  <Sparkles size={20} className="animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Regenerate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
