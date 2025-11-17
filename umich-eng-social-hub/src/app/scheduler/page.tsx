import { PostScheduler } from '@/components/scheduler/PostScheduler';

export default function SchedulerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-umich-blue">Post Scheduler</h1>
        <p className="text-gray-600 mt-1">
          Create and schedule posts across multiple social media platforms
        </p>
      </div>

      <PostScheduler />
    </div>
  );
}
