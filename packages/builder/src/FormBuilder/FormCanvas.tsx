import React from 'react';
import { useDroppable, useDndMonitor, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useFormStore } from '../store/formStore';
import { SortableField } from './SortableField';
import { DropIndicator } from './DropIndicator';

export const FormCanvas: React.FC = () => {
  const { schema } = useFormStore();
  const [isDraggingNewField, setIsDraggingNewField] = React.useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
    data: {
      type: 'canvas',
    },
  });

  const { setNodeRef: setEndDropRef, isOver: isOverEnd } = useDroppable({
    id: 'canvas-end-drop-zone',
    data: {
      type: 'canvas-end',
    },
  });

  // Monitor drag events to determine if we're dragging a new field
  useDndMonitor({
    onDragStart: (event: DragStartEvent) => {
      const activeData = event.active.data.current;
      setIsDraggingNewField(activeData?.type === 'new-field');
    },
    onDragEnd: () => {
      setIsDraggingNewField(false);
    },
  });

  const fieldIds = schema.fields.map((f) => f.id);

  return (
    <div className="form-canvas">
      <div className="canvas-header">
        <h2>{schema.title || 'Untitled Form'}</h2>
        {schema.description && <p>{schema.description}</p>}
      </div>

      <div>
        <div
          ref={setNodeRef}
          className={`canvas-drop-zone ${isOver && isDraggingNewField ? 'drag-over' : ''} ${
            schema.fields.length === 0 ? 'empty' : ''
          }`}
        >
          {schema.fields.length === 0 ? (
            <div className="empty-state">
              <p>Drag and drop fields here to start building your form</p>
            </div>
          ) : (
            <>
              <SortableContext
                items={fieldIds}
                strategy={verticalListSortingStrategy}
              >
                {schema.fields.map((field, index) => (
                  <SortableField key={field.id} field={field} index={index} />
                ))}
              </SortableContext>

              <DropIndicator isVisible={isOverEnd && isDraggingNewField} message="Drop here to add at the end" />
              <div ref={setEndDropRef} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
