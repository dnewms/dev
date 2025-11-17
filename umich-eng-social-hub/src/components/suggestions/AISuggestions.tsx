'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Copy, RefreshCw, Hash, TrendingUp, Clock, Target } from 'lucide-react';
import { mockHashtags } from '@/data/mockData';

export function AISuggestions() {
  const [topic, setTopic] = useState('');
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  const generateCaptions = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const sampleCaptions = [
        `Exciting developments in ${topic || 'engineering'}! Our team is pushing the boundaries of innovation. Learn more about our latest research. #UMichEngineering #Innovation`,
        `Breaking ground on ${topic || 'new technologies'} at University of Michigan Engineering. Join us as we shape the future! 🚀 #GoBlue #Engineering`,
        `Proud to announce our latest breakthrough in ${topic || 'research'}. This is what happens when brilliant minds come together. #UMichEng #Research`,
        `${topic || 'Innovation'} meets excellence at UMich Engineering. Discover how we're making an impact. #Engineering #Michigan`,
      ];
      setGeneratedCaptions(sampleCaptions);
      setIsGenerating(false);
    }, 1500);
  };

  const copyCaptionToClipboard = (caption: string) => {
    navigator.clipboard.writeText(caption);
    alert('Caption copied to clipboard!');
  };

  const toggleHashtag = (tag: string) => {
    setSelectedHashtags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const copyHashtagsToClipboard = () => {
    const hashtagText = selectedHashtags.map((tag) => `#${tag}`).join(' ');
    navigator.clipboard.writeText(hashtagText);
    alert('Hashtags copied to clipboard!');
  };

  const topHashtags = mockHashtags.sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  const trendingHashtags = mockHashtags.filter((h) => h.popularity > 80);
  const categoryHashtags = mockHashtags.reduce((acc, hashtag) => {
    if (!acc[hashtag.category]) {
      acc[hashtag.category] = [];
    }
    acc[hashtag.category].push(hashtag);
    return acc;
  }, {} as Record<string, typeof mockHashtags>);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="captions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="captions">
            <Sparkles className="h-4 w-4 mr-2" />
            Caption Generator
          </TabsTrigger>
          <TabsTrigger value="hashtags">
            <Hash className="h-4 w-4 mr-2" />
            Hashtag Suggestions
          </TabsTrigger>
          <TabsTrigger value="timing">
            <Clock className="h-4 w-4 mr-2" />
            Best Posting Times
          </TabsTrigger>
        </TabsList>

        <TabsContent value="captions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-umich-teal" />
                <span>AI Caption Generator</span>
              </CardTitle>
              <CardDescription>
                Generate engaging captions for your social media posts using AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="topic">What's your post about?</Label>
                <Input
                  id="topic"
                  placeholder="e.g., robotics research, student achievement, campus event"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={generateCaptions}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Captions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedCaptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Captions</CardTitle>
                <CardDescription>
                  Click on any caption to copy it to your clipboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {generatedCaptions.map((caption, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => copyCaptionToClipboard(caption)}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-700 flex-1 pr-4">{caption}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center mt-3 text-xs text-gray-500">
                      <Badge variant="secondary" className="mr-2">
                        {caption.length} characters
                      </Badge>
                      <span>Twitter-friendly</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Target className="h-4 w-4 text-umich-blue mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Be specific about your topic to get more relevant captions
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Target className="h-4 w-4 text-umich-blue mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Customize generated captions to match your brand voice
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Target className="h-4 w-4 text-umich-blue mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Always include #UMichEngineering for brand consistency
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hashtags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-umich-teal" />
                <span>Trending Hashtags</span>
              </CardTitle>
              <CardDescription>Currently popular hashtags for maximum reach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((hashtag) => (
                  <button
                    key={hashtag.tag}
                    onClick={() => toggleHashtag(hashtag.tag)}
                    className={`px-3 py-2 rounded-lg border transition-all ${
                      selectedHashtags.includes(hashtag.tag)
                        ? 'border-umich-blue bg-umich-blue text-umich-maize'
                        : 'border-gray-300 hover:border-umich-blue'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">#{hashtag.tag}</span>
                      <Badge variant="secondary" className="text-xs">
                        {hashtag.popularity}% popular
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hashtags by Category</CardTitle>
              <CardDescription>
                Organized hashtags to help you find the perfect tags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(categoryHashtags).map(([category, hashtags]) => (
                <div key={category}>
                  <h4 className="font-semibold text-sm text-umich-blue mb-2">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((hashtag) => (
                      <button
                        key={hashtag.tag}
                        onClick={() => toggleHashtag(hashtag.tag)}
                        className={`px-3 py-1.5 rounded-md border text-sm transition-all ${
                          selectedHashtags.includes(hashtag.tag)
                            ? 'border-umich-blue bg-umich-blue text-umich-maize'
                            : 'border-gray-300 hover:border-umich-blue'
                        }`}
                      >
                        #{hashtag.tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedHashtags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Hashtags ({selectedHashtags.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-mono">
                    {selectedHashtags.map((tag) => `#${tag}`).join(' ')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={copyHashtagsToClipboard} className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedHashtags([])}
                    className="flex-1"
                  >
                    Clear Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="timing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-umich-teal" />
                <span>Optimal Posting Times</span>
              </CardTitle>
              <CardDescription>
                Best times to post for maximum engagement based on your audience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-sm text-umich-blue mb-3">Twitter/X</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Weekdays</span>
                      <Badge variant="info">Best</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">9-11 AM, 1-3 PM EST</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Weekends</span>
                      <Badge variant="secondary">Good</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">10 AM - 12 PM EST</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-umich-blue mb-3">LinkedIn</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Weekdays</span>
                      <Badge variant="info">Best</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">7-9 AM, 5-6 PM EST</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Weekends</span>
                      <Badge variant="warning">Avoid</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Lower engagement</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-umich-blue mb-3">Instagram</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg bg-pink-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Weekdays</span>
                      <Badge variant="info">Best</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">11 AM - 1 PM, 7-9 PM EST</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-pink-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Weekends</span>
                      <Badge variant="info">Best</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">10 AM - 2 PM EST</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-umich-blue rounded-full mt-1.5" />
                <p className="text-gray-700">
                  Peak engagement occurs during lunch hours (12-1 PM) across all platforms
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-umich-blue rounded-full mt-1.5" />
                <p className="text-gray-700">
                  LinkedIn performs best during business hours on weekdays
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-umich-blue rounded-full mt-1.5" />
                <p className="text-gray-700">
                  Instagram engagement is highest in the evenings and on weekends
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-umich-blue rounded-full mt-1.5" />
                <p className="text-gray-700">
                  Consistency matters more than perfect timing - maintain a regular schedule
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
