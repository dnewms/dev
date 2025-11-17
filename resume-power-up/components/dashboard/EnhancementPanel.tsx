'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { EnhancementStyle } from '@/types';
import { Sparkles, Target, TrendingUp, Linkedin } from 'lucide-react';

interface EnhancementPanelProps {
  onEnhance: (original: string, enhanced: string, style: EnhancementStyle) => void;
  onCreditsUpdate: (credits: number) => void;
}

const STYLES = [
  {
    id: 'action_oriented' as EnhancementStyle,
    name: 'Action-Oriented',
    description: 'Strong action verbs and dynamic language',
    icon: Target,
  },
  {
    id: 'quantified' as EnhancementStyle,
    name: 'Quantified',
    description: 'Data-driven with metrics and numbers',
    icon: TrendingUp,
  },
  {
    id: 'industry_specific' as EnhancementStyle,
    name: 'Industry-Specific',
    description: 'Tailored terminology for your field',
    icon: Sparkles,
  },
  {
    id: 'linkedin' as EnhancementStyle,
    name: 'LinkedIn Optimized',
    description: 'SEO-friendly for LinkedIn profiles',
    icon: Linkedin,
  },
];

export function EnhancementPanel({ onEnhance, onCreditsUpdate }: EnhancementPanelProps) {
  const [text, setText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<EnhancementStyle>('action_oriented');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnhance = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to enhance');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText: text,
          style: selectedStyle,
          industry: industry || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          toast.error('Insufficient credits. Please purchase more credits.');
          return;
        }
        throw new Error(data.error || 'Failed to enhance text');
      }

      onEnhance(text, data.enhancedText, selectedStyle);
      onCreditsUpdate(data.creditsRemaining);
      toast.success('Text enhanced successfully!');
      setText('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to enhance text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Enhance Your Resume</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume Bullet Point
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your resume bullet point here..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enhancement Style
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STYLES.map((style) => {
              const Icon = style.icon;
              return (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={clsx(
                    'flex items-start gap-3 p-4 border-2 rounded-lg text-left transition-all',
                    selectedStyle === style.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  )}
                >
                  <Icon
                    className={clsx(
                      'w-5 h-5 mt-0.5',
                      selectedStyle === style.id ? 'text-primary-600' : 'text-gray-400'
                    )}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{style.name}</div>
                    <div className="text-sm text-gray-600">{style.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedStyle === 'industry_specific' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry (optional)
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., Software Engineering, Marketing, Finance"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        )}

        <Button onClick={handleEnhance} loading={loading} className="w-full" size="lg">
          Enhance with AI
        </Button>
      </div>
    </Card>
  );
}
