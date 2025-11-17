'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Search,
  Image as ImageIcon,
  Video,
  FileText,
  Download,
  Trash2,
  Tag,
} from 'lucide-react';
import { ContentAsset } from '@/types';

interface AssetLibraryProps {
  assets: ContentAsset[];
}

export function AssetLibrary({ assets }: AssetLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'document'>('all');

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || asset.type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTypeIcon = (type: ContentAsset['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-umich-blue transition-colors cursor-pointer">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Support for images, videos, and documents up to 50MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedType('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={selectedType === 'image' ? 'default' : 'outline'}
                onClick={() => setSelectedType('image')}
                size="sm"
              >
                <ImageIcon className="h-4 w-4 mr-1" />
                Images
              </Button>
              <Button
                variant={selectedType === 'video' ? 'default' : 'outline'}
                onClick={() => setSelectedType('video')}
                size="sm"
              >
                <Video className="h-4 w-4 mr-1" />
                Videos
              </Button>
              <Button
                variant={selectedType === 'document' ? 'default' : 'outline'}
                onClick={() => setSelectedType('document')}
                size="sm"
              >
                <FileText className="h-4 w-4 mr-1" />
                Documents
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              {asset.thumbnailUrl ? (
                <div className="w-full h-full bg-gradient-to-br from-umich-blue to-umich-teal flex items-center justify-center">
                  <span className="text-white text-sm">Preview</span>
                </div>
              ) : (
                <div className="p-8">
                  {getTypeIcon(asset.type)}
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm line-clamp-1">{asset.name}</h3>
                {getTypeIcon(asset.type)}
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {formatFileSize(asset.size)} • Uploaded by {asset.uploadedBy}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {asset.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No assets found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
