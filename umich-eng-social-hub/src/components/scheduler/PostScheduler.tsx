'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Twitter, Linkedin, Instagram, Calendar, Clock, Image as ImageIcon, Hash, Sparkles } from 'lucide-react';
import { Platform } from '@/types';

export function PostScheduler() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');

  const platforms = [
    { id: 'twitter' as Platform, name: 'Twitter/X', icon: Twitter, color: 'text-blue-500' },
    { id: 'linkedin' as Platform, name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { id: 'instagram' as Platform, name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  ];

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim().replace('#', '')]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const handleSubmit = (action: 'draft' | 'schedule' | 'publish') => {
    // In a real app, this would send data to an API
    console.log({
      content,
      platforms: selectedPlatforms,
      scheduledDate,
      scheduledTime,
      hashtags,
      action,
    });
    alert(`Post ${action === 'draft' ? 'saved as draft' : action === 'schedule' ? 'scheduled' : 'published'} successfully!`);
  };

  const characterCount = content.length;
  const twitterLimit = 280;
  const isTwitterSelected = selectedPlatforms.includes('twitter');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Post</CardTitle>
            <CardDescription>
              Compose your social media content for multiple platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Platform Selection */}
            <div>
              <Label className="mb-2 block">Select Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-umich-blue bg-umich-blue text-umich-maize'
                          : 'border-gray-300 hover:border-umich-blue'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isSelected ? '' : platform.color}`} />
                      <span className="font-medium">{platform.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="content">Content</Label>
                <span className={`text-xs ${
                  isTwitterSelected && characterCount > twitterLimit
                    ? 'text-red-500 font-semibold'
                    : 'text-gray-500'
                }`}>
                  {characterCount} {isTwitterSelected && `/ ${twitterLimit}`} characters
                </span>
              </div>
              <Textarea
                id="content"
                placeholder="What's happening at UMich Engineering?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className={
                  isTwitterSelected && characterCount > twitterLimit
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
              />
              {isTwitterSelected && characterCount > twitterLimit && (
                <p className="text-xs text-red-500 mt-1">
                  Twitter has a {twitterLimit} character limit
                </p>
              )}
            </div>

            {/* Hashtags */}
            <div>
              <Label htmlFor="hashtags" className="mb-2 block">Hashtags</Label>
              <div className="flex space-x-2 mb-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="hashtags"
                    placeholder="Add hashtag"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                    className="pl-9"
                  />
                </div>
                <Button type="button" onClick={addHashtag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeHashtag(tag)}
                  >
                    #{tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Schedule Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time" className="mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            </div>

            {/* Media Upload Placeholder */}
            <div>
              <Label className="mb-2 block">Media</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-umich-blue transition-colors cursor-pointer">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload images or videos</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF or MP4 up to 10MB</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => handleSubmit('draft')}
                className="flex-1"
              >
                Save Draft
              </Button>
              <Button
                onClick={() => handleSubmit('schedule')}
                disabled={!selectedPlatforms.length || !content}
                className="flex-1"
              >
                Schedule Post
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSubmit('publish')}
                disabled={!selectedPlatforms.length || !content}
                className="flex-1"
              >
                Publish Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-umich-teal" />
              <span>AI Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-sm">
              Generate caption ideas
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              Suggest hashtags
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              Optimize posting time
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-umich-blue rounded-full mt-1.5" />
              <p className="text-gray-700">Use 3-5 relevant hashtags for maximum reach</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-umich-blue rounded-full mt-1.5" />
              <p className="text-gray-700">Include visual content when possible</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-umich-blue rounded-full mt-1.5" />
              <p className="text-gray-700">Post during peak engagement hours (9-11 AM, 1-3 PM)</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-umich-blue rounded-full mt-1.5" />
              <p className="text-gray-700">Always include #UMichEngineering for brand consistency</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
