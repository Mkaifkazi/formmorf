import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useFormStore } from '../store/formStore';
import { getDefaultFieldConfig } from '../config/fieldConfig';
import { nanoid } from 'nanoid';
import { FieldRenderer } from './FieldRenderer';

// Create context for drag state
interface DragStateContextValue {
  activeId: string | null;
  overId: string | null;
  isDraggingNewField: boolean;
}

export const DragStateContext = React.createContext<DragStateContextValue>({
  activeId: null,
  overId: null,
  isDraggingNewField: false,
});

interface DndWrapperProps {
  children: React.ReactNode;
}

export const DndWrapper: React.FC<DndWrapperProps> = ({ children }) => {
  const { schema, addField, moveField, setIsDragging } = useFormStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? (over.id as string) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    setIsDragging(false);

    if (!over) return;

    const activeData = active.data.current;
    const overId = over.id as string;

    // Handle new field drop
    if (activeData?.type === 'new-field') {
      const fieldType = activeData.fieldType;
      const defaultConfig = getDefaultFieldConfig(fieldType);

      // Find the index to insert
      let insertIndex = schema.fields.length;
      if (overId && overId !== 'canvas-drop-zone' && overId !== 'canvas-end-drop-zone') {
        const overIndex = schema.fields.findIndex((f) => f.id === overId);
        insertIndex = overIndex >= 0 ? overIndex : insertIndex;
      }
      // If dropped on canvas-end-drop-zone, always insert at the end
      if (overId === 'canvas-end-drop-zone') {
        insertIndex = schema.fields.length;
      }

      const newField = {
        ...defaultConfig,
        id: nanoid(),
        type: fieldType,
        name: `${fieldType}_${Date.now()}`,
      };

      addField(newField as any, insertIndex);
    }
    // Handle existing field reorder
    else if (activeData?.type === 'existing-field') {
      const activeId = active.id as string;
      if (activeId !== overId) {
        const oldIndex = schema.fields.findIndex((f) => f.id === activeId);
        const newIndex = schema.fields.findIndex((f) => f.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          moveField(oldIndex, newIndex);
        }
      }
    }
  };

  // Create preview field for new field being dragged
  const newFieldPreview = React.useMemo(() => {
    if (activeId?.startsWith('new-')) {
      const fieldType = activeId.replace('new-', '') as any;
      const defaultConfig = getDefaultFieldConfig(fieldType);
      return {
        ...defaultConfig,
        id: 'preview',
        type: fieldType,
        name: `${fieldType}_preview`,
      };
    }
    return null;
  }, [activeId]);

  const activeField = activeId
    ? schema.fields.find((f) => f.id === activeId)
    : null;

  // Create a context value to pass down the drag state
  const dragState = React.useMemo(() => ({
    activeId,
    overId,
    isDraggingNewField: activeId?.startsWith('new-') || false
  }), [activeId, overId]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <DragStateContext.Provider value={dragState}>
        {children}
      </DragStateContext.Provider>

      <DragOverlay>
        {activeField ? (
          <div className="drag-overlay">
            <FieldRenderer field={activeField} readonly />
          </div>
        ) : newFieldPreview ? (
          <div className="drag-overlay new-field-overlay">
            <FieldRenderer field={newFieldPreview as any} readonly />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
