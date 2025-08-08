// src/pages/DefineTopic/DefineTopicPage.tsx
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MindmapCanvas } from '@/widgets/mindmap/MindmapCanvas';
import { TOPIC_PRESETS } from '@/data/presets/topic';
import { makeTopicSchema } from './makeTopicSchema';

function cap(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

export default function DefineTopicPage() {
  const { slug = 'happiness' } = useParams();

  const preset = TOPIC_PRESETS[slug.toLowerCase()] ?? TOPIC_PRESETS.happiness;
  const schema = useMemo(
    () => makeTopicSchema(cap(slug), preset.question, preset.others),
    [slug, preset]
  );

  return (
    <main className="min-h-screen bg-neutral-50 pt-6">
      <MindmapCanvas schema={schema} />
    </main>
  );
}