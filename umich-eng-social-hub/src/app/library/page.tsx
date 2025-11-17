import { AssetLibrary } from '@/components/library/AssetLibrary';
import { mockAssets } from '@/data/mockData';

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-umich-blue">Content Library</h1>
        <p className="text-gray-600 mt-1">
          Manage your media assets and brand resources
        </p>
      </div>

      <AssetLibrary assets={mockAssets} />
    </div>
  );
}
