'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { EnhancementStyle } from '@/types';

interface Enhancement {
  original: string;
  enhanced: string;
  style: EnhancementStyle;
}

interface ComparisonViewProps {
  enhancements: Enhancement[];
  onExport: () => void;
}

export function ComparisonView({ enhancements, onExport }: ComparisonViewProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (enhancements.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500">No enhancements yet. Start by enhancing a bullet point!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Before & After</h2>
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {enhancements.map((enhancement, index) => (
        <Card key={index} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
              {enhancement.style.replace('_', ' ')}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Before</h3>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 text-sm leading-relaxed">{enhancement.original}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">After</h3>
                <button
                  onClick={() => copyToClipboard(enhancement.enhanced)}
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-gray-900 text-sm leading-relaxed font-medium">
                  {enhancement.enhanced}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
