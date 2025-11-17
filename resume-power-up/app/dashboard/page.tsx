'use client';

import { useEffect, useState } from 'react';
import { EnhancementPanel } from '@/components/dashboard/EnhancementPanel';
import { ComparisonView } from '@/components/dashboard/ComparisonView';
import { CreditsDisplay } from '@/components/dashboard/CreditsDisplay';
import { Navbar } from '@/components/dashboard/Navbar';
import type { Profile, EnhancementStyle } from '@/types';
import toast from 'react-hot-toast';

interface Enhancement {
  original: string;
  enhanced: string;
  style: EnhancementStyle;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhance = (original: string, enhanced: string, style: EnhancementStyle) => {
    setEnhancements([{ original, enhanced, style }, ...enhancements]);
  };

  const handleCreditsUpdate = (credits: number) => {
    if (profile) {
      setProfile({ ...profile, credits });
    }
  };

  const handleExport = () => {
    if (enhancements.length === 0) {
      toast.error('No enhancements to export');
      return;
    }

    const content = enhancements
      .map((e, i) => `${i + 1}. ${e.enhanced}`)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enhanced-resume-bullets.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Exported successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Transform your resume bullets into powerful statements</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <EnhancementPanel
              onEnhance={handleEnhance}
              onCreditsUpdate={handleCreditsUpdate}
            />

            <ComparisonView enhancements={enhancements} onExport={handleExport} />
          </div>

          <div className="space-y-6">
            {profile && (
              <CreditsDisplay
                credits={profile.credits}
                subscriptionStatus={profile.subscription_status}
              />
            )}

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Be specific about your achievements and responsibilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Include context about the project or role</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Try different enhancement styles for variety</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Use industry-specific mode for technical roles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
