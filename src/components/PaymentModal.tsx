import { useState } from 'react';
import { X, CreditCard, Check, Loader2 } from 'lucide-react';
import { getCurrentUserId } from '../services/user';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      setError('');

      const userId = getCurrentUserId();
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to start payment process. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Upgrade to Pro</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center py-6">
            <div className="mb-2">
              <span className="text-5xl font-bold text-gray-900">$24</span>
            </div>
            <div className="text-gray-600">
              Lifetime Access
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Unlimited Carousels</div>
                <div className="text-sm text-gray-600">Generate as many carousels as you want</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Unlimited Exports</div>
                <div className="text-sm text-gray-600">Export to PDF without limits</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Priority Support</div>
                <div className="text-sm text-gray-600">Get help when you need it</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">All Future Features</div>
                <div className="text-sm text-gray-600">Access to all upcoming features</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={24} />
                Get Lifetime Access
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
