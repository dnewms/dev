'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SocialPost, Platform } from '@/types';

interface CalendarViewProps {
  posts: SocialPost[];
}

const platformColors: Record<Platform, string> = {
  twitter: 'bg-blue-500',
  linkedin: 'bg-blue-700',
  instagram: 'bg-pink-500',
};

export function CalendarView({ posts }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getPostsForDay = (day: number) => {
    return posts.filter((post) => {
      if (!post.scheduledDate) return false;
      const postDate = new Date(post.scheduledDate);
      return (
        postDate.getDate() === day &&
        postDate.getMonth() === month &&
        postDate.getFullYear() === year
      );
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-umich-blue">
            {monthNames[month]} {year}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Day names */}
          {dayNames.map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-gray-600 p-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-24 p-2" />
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayPosts = getPostsForDay(day);
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year;

            return (
              <div
                key={day}
                className={`min-h-24 p-2 border rounded-lg ${
                  isToday ? 'bg-umich-maize/10 border-umich-blue' : 'bg-white'
                } hover:shadow-md transition-shadow`}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-umich-blue' : 'text-gray-700'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayPosts.map((post) => (
                    <div
                      key={post.id}
                      className="text-xs p-1 rounded bg-umich-blue/10 border-l-2 border-umich-blue"
                    >
                      <div className="flex flex-wrap gap-1 mb-1">
                        {post.platforms.map((platform) => (
                          <div
                            key={platform}
                            className={`w-2 h-2 rounded-full ${platformColors[platform]}`}
                            title={platform}
                          />
                        ))}
                      </div>
                      <p className="line-clamp-2 text-gray-700">
                        {post.content.substring(0, 50)}...
                      </p>
                      {post.scheduledDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(post.scheduledDate).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-semibold text-gray-700 mb-2">Platform Legend:</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600">Twitter/X</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-700" />
              <span className="text-sm text-gray-600">LinkedIn</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <span className="text-sm text-gray-600">Instagram</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
