import React from 'react';
import * as api from '../api';

export default function UpgradeModal({ isOpen, onClose }) {
  const handleUpgrade = async () => {
    try {
      const { checkout_url } = await api.upgradeToPremium();
      window.location.href = checkout_url;
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-6">
          Upgrade to Premium
        </h2>
        
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              Premium Benefits
            </h3>
            <ul className="text-gray-300 space-y-2">
              <li>✓ Unlimited document uploads</li>
              <li>✓ Unlimited chatbot queries</li>
              <li>✓ Priority support</li>
              <li>✓ Advanced analytics</li>
            </ul>
            <div className="mt-4 text-2xl font-bold text-white">
              $100<span className="text-sm font-normal">/month</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpgrade}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Upgrade Now
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}