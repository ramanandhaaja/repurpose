'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const SocialCalendarLayout = () => {
  const today = new Date('2024-12-18T22:46:12+07:00');
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const start = startOfWeek(startOfMonth(today));
  const end = endOfWeek(endOfMonth(today));
  const days = eachDayOfInterval({ start, end });

  const dummyPosts = [
    {
      platform: 'twitter',
      content: 'Exciting new features coming to our product! Stay tuned...',
      scheduledFor: '2024-12-20 10:00 AM',
      status: 'scheduled'
    },
    {
      platform: 'instagram',
      content: 'Behind the scenes look at our team working on the next big update!',
      scheduledFor: '2024-12-21 2:00 PM',
      status: 'draft'
    }
  ];

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
                      {i % 7 === 3 && <div className="w-1 h-1 rounded-full bg-blue-400" />}
                      {i % 5 === 2 && <div className="w-1 h-1 rounded-full bg-pink-500" />}
                      {i % 4 === 1 && <div className="w-1 h-1 rounded-full bg-blue-700" />}
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
              <div className="space-y-4">
                {/* Time Header */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  Upcoming Posts
                </div>

                {/* Scheduled Posts */}
                <div className="space-y-4">
                  {dummyPosts.map((post, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        {/* Platform Icon */}
                        <div className="flex items-center gap-2">
                          {post.platform === 'twitter' && <Twitter className="w-4 h-4 text-blue-400" />}
                          {post.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                          {post.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-700" />}
                          <span className="capitalize text-sm font-medium">{post.platform}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          post.status === 'scheduled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {post.status}
                        </span>
                      </div>

                      {/* Post Content Preview */}
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {post.content}
                      </p>

                      {/* Scheduled Time */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {post.scheduledFor}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Available Time Slots</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      10:00 AM
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      2:00 PM
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      4:00 PM
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      7:00 PM
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialCalendarLayout;