import { CalendarView } from '@/components/calendar/CalendarView';
import { mockPosts } from '@/data/mockData';

export default function CalendarPage() {
  const scheduledPosts = mockPosts.filter(
    (post) => post.status === 'scheduled' || post.scheduledDate
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-umich-blue">Content Calendar</h1>
        <p className="text-gray-600 mt-1">
          View and manage your scheduled social media posts
        </p>
      </div>

      <CalendarView posts={scheduledPosts} />
    </div>
  );
}
