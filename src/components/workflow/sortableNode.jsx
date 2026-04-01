'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function SortableNode({ id, label }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-4 flex items-center gap-3 cursor-move border-purple-200">
      <GripVertical {...attributes} {...listeners} className="text-gray-500" />
      <span>{label}</span>
    </Card>
  );
}
