import { MindmapCanvas } from '@/widgets/mindmap/MindmapCanvas';
import { defineSchema } from './define.schema';

export default function DefinePage() {
  return (
    <main className="min-h-screen bg-neutral-50 pt-6">
      <MindmapCanvas schema={defineSchema} />
    </main>
  );
}