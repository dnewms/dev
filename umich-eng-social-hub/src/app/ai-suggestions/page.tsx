import { AISuggestions } from '@/components/suggestions/AISuggestions';

export default function AISuggestionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-umich-blue">AI-Powered Suggestions</h1>
        <p className="text-gray-600 mt-1">
          Get intelligent recommendations for captions, hashtags, and posting times
        </p>
      </div>

      <AISuggestions />
    </div>
  );
}
