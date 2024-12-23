'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  RefreshCw,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useOriginalContentList } from '@/app/hooks/useManageTask';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
//import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Calendar } from '@/components/ui/calendar';
//import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import "react-day-picker/dist/style.css"; // Add this import at the top
//import { cn } from "@/lib/utils";

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
  const { contentList, isLoading, hasMore, loadMore } = useOriginalContentList();
  const [selectedContent, setSelectedContent] = useState<OriginalContent | null>(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const getContentForPlatform = (platform: string) => {
    return selectedContent?.repurposed_content?.find(
      content => content.output_type.toLowerCase() === platform.toLowerCase()
    )?.content || '';
  };

  const hasContentForPlatform = (platform: string) => {
    return !!selectedContent?.repurposed_content?.some(
      content => content.output_type.toLowerCase() === platform.toLowerCase() && content.content.trim().length > 0
    );
  };

  const getScheduledDateTime = () => {
    if (!selectedDate) return null;
    const [hours, minutes] = selectedTime.split(':');
    const datetime = new Date(selectedDate);
    datetime.setHours(parseInt(hours), parseInt(minutes));
    return datetime;
  };

  const handleSchedule = () => {
    const scheduledDateTime = getScheduledDateTime();
    console.log('Scheduling for:', selectedPlatform, 'on', scheduledDateTime);
    setIsScheduleOpen(false);
  };

  const handleScheduleClick = (platform: string) => {
    setSelectedPlatform(platform);
    setScheduleDialogOpen(true);
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
                {isLoading && contentList.length === 0 ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    {contentList.map((content) => (
                      <div
                        key={content.id}
                        className={`p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors ${selectedContent?.id === content.id ? 'border-blue-500 bg-blue-50' : ''
                          }`}
                        onClick={() => setSelectedContent(content)}
                      >
                        <div className="flex items-center gap-4">
                          {content.content_url && content.content_type === 'image' && (
                            <div className="flex-shrink-0">
                              <Image
                                src={content.content_url}
                                alt={content.title || 'Content image'}
                                width={64}
                                height={64}
                                className="object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewImageUrl(content.content_url);
                                  setOpenPreviewDialog(true);
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
                    ))}
                    {hasMore && (
                      <div className="mt-4 flex justify-center">
                        <Button
                          variant="outline"
                          onClick={loadMore}
                          className="flex items-center gap-2"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Loading...' : 'Load More'}
                          {!isLoading && <RefreshCw className="w-4 h-4" />}
                        </Button>
                      </div>
                    )}
                  </>
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleScheduleClick('twitter')}
                        disabled={!hasContentForPlatform('twitter')}
                      >
                        <Download className="w-4 h-4" />
                        Schedule Post
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleScheduleClick('instagram')}
                        disabled={!hasContentForPlatform('instagram')}
                      >
                        <Download className="w-4 h-4" />
                        Schedule Post
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleScheduleClick('linkedin')}
                        disabled={!hasContentForPlatform('linkedin')}
                      >
                        <Download className="w-4 h-4" />
                        Schedule Post
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Replace the existing Image Preview Modal with this */}
      <Dialog open={openPreviewDialog} onOpenChange={setOpenPreviewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>Image Preview</DialogTitle>
          {previewImageUrl && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={previewImageUrl}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Replace the existing Scheduling Modal with this */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Schedule {selectedPlatform} Post</DialogTitle>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Content Preview</h4>
              <div className="p-4 rounded-md bg-gray-50 max-h-[200px] overflow-y-auto">
                {getContentForPlatform(selectedPlatform)}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Select Date and Time</h4>
              <div className="grid gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {selectedDate ? format(selectedDate, "PPP") : "No date selected"}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const compareDate = new Date(date);
                        compareDate.setHours(0, 0, 0, 0);
                        return compareDate < today;
                      }}
                      initialFocus
                    />
                  </div>
                </div>



                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {Array.from({ length: 24 * 4 }).map((_, i) => {
                    const hour = Math.floor(i / 4);
                    const minute = (i % 4) * 15;
                    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    return (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              handleSchedule();
              setScheduleDialogOpen(false);
            }}>
              Schedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentRepurposingLayout;
