'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Twitter,
  Instagram,
  Linkedin,
  Download,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { useOriginalContentList } from '@/app/hooks/useOriginalContentList';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

interface OriginalContent {
  id: string;
  userId: string;
  title: string;
  content_type: string;
  content_url: string;
  content_text: string;
  file_path: string | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
  repurposed_content?: {
    id: string;
    output_type: string;
    tone: string;
    content: string;
  }[];
}

const ContentRepurposingLayout = () => {
  const { contentList, isLoading, error } = useOriginalContentList();
  const [selectedContent, setSelectedContent] = useState<OriginalContent | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getContentForPlatform = (platform: string) => {
    return selectedContent?.repurposed_content?.find(
      content => content.output_type.toLowerCase() === platform.toLowerCase()
    )?.content || '';
  };

  return (
    <div className="h-screen">
      {/* Main horizontal split */}
      <div className="flex flex-row h-full">
        {/* Left Half - Task History */}
        <div className="w-1/2 p-6 border-r h-full">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-4">
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  contentList.map((content) => (
                    <div 
                      key={content.id} 
                      className={`p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors ${
                        selectedContent?.id === content.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedContent(content)}
                    >
                      <div className="flex items-center gap-4">
                        {content.content_url && content.content_type === 'image' && (
                          <div className="flex-shrink-0">
                            <img 
                              src={content.content_url} 
                              alt={content.title || 'Content image'} 
                              className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering parent click
                                setPreviewImage(content.content_url);
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium">{content.title || 'Untitled'}</h3>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                          <p className="text-sm text-gray-500">
                            {format(new Date(content.created_at as string), 'MMM dd, yyyy HH:mm')}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                              {content.content_type}
                            </span>
                            {content.repurposed_content?.map((repurposed) => (
                              <span key={repurposed.id} className="text-xs px-2 py-1 bg-blue-100 rounded-full">
                                {repurposed.output_type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Half - Social Media Content */}
        <div className="w-1/2 p-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {selectedContent ? 'Repurposed Content' : 'Select a task to view content'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="twitter" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="twitter" className="flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </TabsTrigger>
                  <TabsTrigger value="instagram" className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </TabsTrigger>
                </TabsList>

                {/* Twitter Content */}
                <TabsContent value="twitter">
                  <div className="space-y-4">
                    <textarea
                      className="w-full h-[calc(100vh-300px)] p-4 rounded-md border border-gray-200 resize-none"
                      placeholder={selectedContent ? "No Twitter content available" : "Select a task to view content"}
                      value={getContentForPlatform('twitter')}
                      readOnly
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {getContentForPlatform('twitter').length} / 280 characters
                      </span>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Instagram Content */}
                <TabsContent value="instagram">
                  <div className="space-y-4">
                    <textarea
                      className="w-full h-[calc(100vh-300px)] p-4 rounded-md border border-gray-200 resize-none"
                      placeholder={selectedContent ? "No Instagram content available" : "Select a task to view content"}
                      value={getContentForPlatform('instagram')}
                      readOnly
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {getContentForPlatform('instagram').length} / 2200 characters
                      </span>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* LinkedIn Content */}
                <TabsContent value="linkedin">
                  <div className="space-y-4">
                    <textarea
                      className="w-full h-[calc(100vh-300px)] p-4 rounded-md border border-gray-200 resize-none"
                      placeholder={selectedContent ? "No LinkedIn content available" : "Select a task to view content"}
                      value={getContentForPlatform('linkedin')}
                      readOnly
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {getContentForPlatform('linkedin').length} / 3000 characters
                      </span>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="sm:max-w-[800px] p-0">
          <DialogTitle asChild>
            <VisuallyHidden>Image Preview</VisuallyHidden>
          </DialogTitle>
          <div className="relative">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentRepurposingLayout;