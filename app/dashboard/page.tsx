'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Bar
} from 'recharts';
import { 
  FileText, 
  Repeat, 
  TrendingUp,
  Clock,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const DashboardContent = () => {
  // Sample data for charts
  const contentStats = [
    { month: 'Jan', original: 12, repurposed: 36 },
    { month: 'Feb', original: 15, repurposed: 45 },
    { month: 'Mar', original: 18, repurposed: 54 },
    { month: 'Apr', original: 20, repurposed: 60 },
    { month: 'May', original: 25, repurposed: 75 },
    { month: 'Jun', original: 22, repurposed: 66 }
  ];

  const platformStats = [
    { platform: 'Instagram', posts: 24, engagement: 12500, growth: 15 },
    { platform: 'Twitter', posts: 36, engagement: 8500, growth: -5 },
    { platform: 'LinkedIn', posts: 18, engagement: 6000, growth: 25 },
    { platform: 'YouTube', posts: 12, engagement: 20000, growth: 10 }
  ];

  const monthlyAnalyticsData = [
    { month: 'Jan', engagement: 1200, reach: 5000 },
    { month: 'Feb', engagement: 1500, reach: 5500 },
    { month: 'Mar', engagement: 1800, reach: 6000 },
    { month: 'Apr', engagement: 2000, reach: 6500 },
    { month: 'May', engagement: 2200, reach: 7000 },
    { month: 'Jun', engagement: 2400, reach: 7500 }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return Instagram;
      case 'twitter': return Twitter;
      case 'linkedin': return Linkedin;
      case 'youtube': return Youtube;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Content Pieces</p>
                <h3 className="text-2xl font-bold mt-2">156</h3>
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <ArrowUpRight size={16} className="mr-1" /> +12% this month
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Repurposed Content</p>
                <h3 className="text-2xl font-bold mt-2">468</h3>
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <ArrowUpRight size={16} className="mr-1" /> +18% this month
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Repeat size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Engagement</p>
                <h3 className="text-2xl font-bold mt-2">24.5K</h3>
                <p className="text-sm text-red-600 flex items-center mt-2">
                  <ArrowDownRight size={16} className="mr-1" /> -3% this month
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Time Saved</p>
                <h3 className="text-2xl font-bold mt-2">126h</h3>
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <ArrowUpRight size={16} className="mr-1" /> +8% this month
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Content Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={contentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="original" 
                  stroke="#8884d8" 
                  name="Original Content"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="repurposed" 
                  stroke="#82ca9d" 
                  name="Repurposed Content"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="engagement" stroke="#8884d8" name="Engagement" strokeWidth={2} />
                <Line type="monotone" dataKey="reach" stroke="#82ca9d" name="Reach" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Platform Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {platformStats.map((platform) => {
                const Icon = getPlatformIcon(platform.platform);
                return (
                  <div 
                    key={platform.platform} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-white">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-medium">{platform.platform}</h4>
                        <p className="text-sm text-gray-500">
                          {platform.posts} posts · {platform.engagement} engagements
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center ${
                      platform.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {platform.growth > 0 ? (
                        <ArrowUpRight size={16} className="mr-1" />
                      ) : (
                        <ArrowDownRight size={16} className="mr-1" />
                      )}
                      {Math.abs(platform.growth)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="engagement" fill="#8884d8" name="Engagement" />
                  <Bar dataKey="posts" fill="#82ca9d" name="Posts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;