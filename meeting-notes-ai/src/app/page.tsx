import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Mic,
  FileText,
  Users,
  Zap,
  Shield,
  Search,
  Download,
  CheckCircle,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mic className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">MeetingNotes AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Turn Meetings Into Action
          <br />
          With AI-Powered Notes
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Never miss important details again. Automatically transcribe, summarize, and extract
          action items from your meetings. The smart alternative to Otter.ai and Fireflies.ai.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Free Trial
              <span className="ml-2">→</span>
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              View Pricing
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">No credit card required • 3 free meetings per month</p>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Mic className="h-10 w-10 text-primary" />}
            title="AI Transcription"
            description="Powered by OpenAI Whisper for industry-leading accuracy"
          />
          <FeatureCard
            icon={<FileText className="h-10 w-10 text-primary" />}
            title="Smart Summaries"
            description="Get AI-generated summaries, key points, and decisions"
          />
          <FeatureCard
            icon={<CheckCircle className="h-10 w-10 text-primary" />}
            title="Action Items"
            description="Automatically extract tasks and assignments"
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Speaker ID"
            description="Identify and track different speakers in your meetings"
          />
          <FeatureCard
            icon={<Search className="h-10 w-10 text-primary" />}
            title="Smart Search"
            description="Search across all meetings and transcripts instantly"
          />
          <FeatureCard
            icon={<Download className="h-10 w-10 text-primary" />}
            title="Export Anywhere"
            description="Export to PDF, Markdown, or Notion with one click"
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Team Collaboration"
            description="Share meetings and collaborate with your team"
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Secure & Private"
            description="Enterprise-grade security for your meeting data"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Step number="1" title="Upload or Record" description="Upload audio/video files or record directly in your browser" />
            <Step number="2" title="AI Processing" description="Our AI transcribes and analyzes your meeting automatically" />
            <Step number="3" title="Get Insights" description="Review summaries, action items, and full transcripts instantly" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Meetings?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of teams using MeetingNotes AI
        </p>
        <Link href="/auth/signup">
          <Button size="lg" className="text-lg px-8 py-6">
            Get Started Free
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Mic className="h-6 w-6" />
            <span className="text-xl font-bold">MeetingNotes AI</span>
          </div>
          <p className="text-gray-400">
            © 2024 MeetingNotes AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
