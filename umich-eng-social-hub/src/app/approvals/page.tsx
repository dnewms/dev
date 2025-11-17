import { ApprovalWorkflow } from '@/components/workflow/ApprovalWorkflow';
import { mockPosts } from '@/data/mockData';

export default function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-umich-blue">Content Approvals</h1>
        <p className="text-gray-600 mt-1">
          Review and approve posts before they are published
        </p>
      </div>

      <ApprovalWorkflow posts={mockPosts} />
    </div>
  );
}
