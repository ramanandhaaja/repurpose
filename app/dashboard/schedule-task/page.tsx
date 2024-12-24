'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Twitter,
  Instagram,
  Linkedin,
  Clock,
  CalendarDays,
  PlusCircle,
  Filter
} from 'lucide-react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth } from 'date-fns';
import { useScheduleTask, getPostsByDate } from '@/app/hooks/useScheduleTask';

const SocialCalendarLayout = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const { scheduledPosts, isLoading } = useScheduleTask();
  const postsByDate = getPostsByDate(scheduledPosts);

  // Get posts for a specific date
  const getPostsForDate = (date: Date) => {
    const dateStr = date.toLocaleDateString();
    return postsByDate[dateStr] || [];
  };

  // Get platform-specific posts for a date
  const getPlatformPostsForDate = (date: Date, platform: string) => {
    const datePosts = getPostsForDate(date);
    return datePosts.filter(post => post.platform.toLowerCase() === platform.toLowerCase());
  };

  const start = startOfWeek(startOfMonth(today));
  const end = endOfWeek(endOfMonth(today));
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="h-screen">
      {/* Main horizontal split */}
      <div className="flex flex-row h-full">
        {/* Left Half - Calendar View */}
        <div className="w-3/5 p-6 border-r">
          <div className="h-full flex flex-col">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">{format(today, 'MMMM yyyy')}</h2>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Schedule Post
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-36">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-[auto_repeat(5,1fr)] gap-1 bg-white rounded-lg border p-4 h-[500px]">
              {/* Calendar Days Header */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days Grid */}
              {days.map((day, i) => {
                const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={`p-2 border rounded-md hover:bg-gray-50 cursor-pointer flex flex-col ${
                      !isSameMonth(day, today) ? 'text-gray-400' : ''
                    } ${isToday ? 'border-green-500 bg-blue-50' : ''} ${
                      isSelected && !isToday ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <div className="text-sm">{format(day, 'd')}</div>
                    {/* Post indicators */}
                    <div className="flex gap-1 mt-1">
                      {/* Twitter posts - blue */}
                      {getPlatformPostsForDate(day, 'twitter').length > 0 && (
                        <div className="w-1 h-1 rounded-full bg-blue-400" />
                      )}
                      {/* Instagram posts - pink */}
                      {getPlatformPostsForDate(day, 'instagram').length > 0 && (
                        <div className="w-1 h-1 rounded-full bg-pink-500" />
                      )}
                      {/* LinkedIn posts - dark blue */}
                      {getPlatformPostsForDate(day, 'linkedin').length > 0 && (
                        <div className="w-1 h-1 rounded-full bg-blue-700" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Half - Schedule Details */}
        <div className="w-2/5 p-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Scheduled Posts
                </div>
                <Button variant="outline" size="sm">Today</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {getPostsForDate(selectedDate).map((post) => (
                    <div
                      key={post.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {post.platform === 'twitter' && <Twitter className="w-4 h-4 text-blue-400" />}
                          {post.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                          {post.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-700" />}
                          <span className="font-medium capitalize">{post.platform}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(post.scheduled_for), 'h:mm a')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.content}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={
                          post.status === 'pending' ? 'default' :
                          post.status === 'published' ? 'secondary' :
                          'destructive'
                        }>
                          {post.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialCalendarLayout;