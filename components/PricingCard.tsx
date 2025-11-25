import React from 'react';
import { Check } from 'lucide-react';
import { PricingTier } from '../types';

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (tier: PricingTier) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ tier, onSelect }) => {
  return (
    <div className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col h-full ${tier.highlight ? 'border-indigo-600 ring-1 ring-indigo-600 shadow-xl' : 'border-gray-200 hover:border-indigo-300 transition-colors'}`}>
      {tier.highlight && (
        <div className="absolute top-0 right-0 -mt-3 mr-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Recomendado
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{tier.title}</h3>
        <div className="mt-4 flex items-baseline text-gray-900">
          <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
          {tier.period && <span className="ml-1 text-xl font-semibold text-gray-500">/{tier.period}</span>}
        </div>
      </div>
      <ul className="mt-6 space-y-4 flex-1">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" aria-hidden="true" />
            <span className="ml-3 text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <button
          onClick={() => onSelect(tier)}
          className={`block w-full py-3 px-6 border border-transparent rounded-lg text-center font-medium transition-all ${
            tier.highlight
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
          }`}
        >
          {tier.cta}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;