import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type { FieldDefinition, FormSchema, DeviceType } from '../types';
import { validateField } from '../utils/validation';

interface HistoryState {
  schema: FormSchema;
  selectedFieldId: string | null;
}

interface FormState {
  schema: FormSchema;
  selectedFieldId: string | null;
  isDragging: boolean;
  formValues: Record<string, any>;
  formErrors: Record<string, string>;

  // History management
  history: HistoryState[];
  historyIndex: number;
  maxHistorySize: number;

  // Preview device
  previewDevice: DeviceType;

  // Actions
  setSchema: (schema: FormSchema) => void;
  addField: (field: FieldDefinition, index?: number) => void;
  updateField: (fieldId: string, updates: Partial<FieldDefinition>) => void;
  removeField: (fieldId: string) => void;
  moveField: (fromIndex: number, toIndex: number) => void;
  duplicateField: (fieldId: string) => void;
  selectField: (fieldId: string | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  clearForm: () => void;
  updateFormSettings: (settings: Partial<FormSchema['settings']>) => void;
  updateFormMetadata: (metadata: { title?: string; description?: string }) => void;
  setFieldValue: (fieldId: string, value: any) => void;
  setFieldError: (fieldId: string, error: string | null) => void;
  validateField: (fieldId: string) => string | null;
  validateForm: () => boolean;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  setPreviewDevice: (device: DeviceType) => void;
}

const initialSchema: FormSchema = {
  id: nanoid(),
  title: 'Untitled Form',
  description: '',
  fields: [],
  settings: {
    submitButtonText: 'Submit',
    cancelButtonText: 'Cancel',
    showLabels: true,
    labelPosition: 'top',
    theme: 'light',
  },
};

export const useFormStore: UseBoundStore<StoreApi<FormState>> = create<FormState>()(
  immer((set, get) => {
    // Helper function to add current state to history after a change
    const addToHistory = () => {
      set((draft) => {
        const newState: HistoryState = {
          schema: JSON.parse(JSON.stringify(draft.schema)),
          selectedFieldId: draft.selectedFieldId,
        };

        // Remove any future history when making a new change
        draft.history = draft.history.slice(0, draft.historyIndex + 1);

        // Add new state to history
        draft.history.push(newState);

        // Move index to the new state
        draft.historyIndex = draft.history.length - 1;

        // Limit history size
        if (draft.history.length > draft.maxHistorySize) {
          draft.history.shift();
          draft.historyIndex--;
        }
      });
    };

    const initialHistoryState: HistoryState = {
      schema: JSON.parse(JSON.stringify(initialSchema)),
      selectedFieldId: null,
    };

    return {
      schema: initialSchema,
      selectedFieldId: null,
      isDragging: false,
      formValues: {},
      formErrors: {},

      // History state - start with initial state in history
      history: [initialHistoryState],
      historyIndex: 0,
      maxHistorySize: 50,

      // Preview device - default to desktop
      previewDevice: 'desktop',

      setSchema: (schema) =>
        set((state) => {
          state.schema = schema;
          state.formValues = {};
          state.formErrors = {};
          // Reset history when loading a new schema with the new schema as initial state
          const newInitialState: HistoryState = {
            schema: JSON.parse(JSON.stringify(schema)),
            selectedFieldId: null,
          };
          state.history = [newInitialState];
          state.historyIndex = 0;
        }),

    addField: (field, index) => {
      set((state) => {
        const newField = {
          ...field,
          id: field.id || nanoid(),
        };

        if (index !== undefined && index >= 0) {
          state.schema.fields.splice(index, 0, newField);
        } else {
          state.schema.fields.push(newField);
        }

        state.selectedFieldId = newField.id;
      });
      addToHistory();
    },

    updateField: (fieldId, updates) => {
      set((state) => {
        const fieldIndex = state.schema.fields.findIndex((f) => f.id === fieldId);
        if (fieldIndex !== -1) {
          state.schema.fields[fieldIndex] = {
            ...state.schema.fields[fieldIndex],
            ...updates,
          };
        }
      });
      addToHistory();
    },

    removeField: (fieldId) => {
      set((state) => {
        state.schema.fields = state.schema.fields.filter((f) => f.id !== fieldId);
        if (state.selectedFieldId === fieldId) {
          state.selectedFieldId = null;
        }
      });
      addToHistory();
    },

    moveField: (fromIndex, toIndex) => {
      if (fromIndex === toIndex) return;
      set((state) => {
        const field = state.schema.fields[fromIndex];
        state.schema.fields.splice(fromIndex, 1);
        state.schema.fields.splice(toIndex, 0, field);
      });
      addToHistory();
    },

    duplicateField: (fieldId) => {
      set((state) => {
        const fieldIndex = state.schema.fields.findIndex((f) => f.id === fieldId);
        if (fieldIndex !== -1) {
          const field = state.schema.fields[fieldIndex];
          const duplicatedField = {
            ...field,
            id: nanoid(),
            name: field.name ? `${field.name}_copy` : undefined,
            label: field.label ? `${field.label} (Copy)` : undefined,
          };
          state.schema.fields.splice(fieldIndex + 1, 0, duplicatedField);
          state.selectedFieldId = duplicatedField.id;
        }
      });
      addToHistory();
    },

    selectField: (fieldId) =>
      set((state) => {
        state.selectedFieldId = fieldId;
      }),

    setIsDragging: (isDragging) =>
      set((state) => {
        state.isDragging = isDragging;
      }),

    clearForm: () =>
      set((state) => {
        state.schema = {
          ...initialSchema,
          id: nanoid(),
        };
        state.selectedFieldId = null;
      }),

    updateFormSettings: (settings) => {
      set((state) => {
        state.schema.settings = {
          ...state.schema.settings,
          ...settings,
        };
      });
      addToHistory();
    },

    updateFormMetadata: (metadata) => {
      set((state) => {
        if (metadata.title !== undefined) {
          state.schema.title = metadata.title;
        }
        if (metadata.description !== undefined) {
          state.schema.description = metadata.description;
        }
      });
      addToHistory();
    },

    setFieldValue: (fieldId, value) =>
      set((state) => {
        const field = state.schema.fields.find(f => f.id === fieldId);
        if (field && field.name) {
          state.formValues[field.name] = value;
        }
      }),

    setFieldError: (fieldId, error) =>
      set((state) => {
        if (error) {
          state.formErrors[fieldId] = error;
        } else {
          delete state.formErrors[fieldId];
        }
      }),

    validateField: (fieldId) => {
      const state = get();
      const field = state.schema.fields.find(f => f.id === fieldId);
      if (!field) return null;

      const value = field.name ? state.formValues[field.name] : undefined;
      const error = validateField(field, value, state.formValues);

      set((state) => {
        if (error) {
          state.formErrors[fieldId] = error;
        } else {
          delete state.formErrors[fieldId];
        }
      });

      return error;
    },

    validateForm: () => {
      const state = get();
      let isValid = true;

      state.schema.fields.forEach(field => {
        const value = field.name ? state.formValues[field.name] : undefined;
        const error = validateField(field, value, state.formValues);

        if (error) {
          isValid = false;
          set((state) => {
            state.formErrors[field.id] = error;
          });
        }
      });

      return isValid;
    },

    // History actions
    undo: () => {
      const state = get();
      if (state.historyIndex > 0) {
        set((draft) => {
          draft.historyIndex--;
          const historyState = draft.history[draft.historyIndex];
          draft.schema = JSON.parse(JSON.stringify(historyState.schema));
          draft.selectedFieldId = historyState.selectedFieldId;
        });
      }
    },

    redo: () => {
      const state = get();
      if (state.historyIndex < state.history.length - 1) {
        set((draft) => {
          draft.historyIndex++;
          const historyState = draft.history[draft.historyIndex];
          draft.schema = JSON.parse(JSON.stringify(historyState.schema));
          draft.selectedFieldId = historyState.selectedFieldId;
        });
      }
    },

    canUndo: () => {
      const state = get();
      return state.historyIndex > 0;
    },

    canRedo: () => {
      const state = get();
      return state.historyIndex < state.history.length - 1;
    },

    setPreviewDevice: (device) =>
      set((state) => {
        state.previewDevice = device;
      }),
  };
})
);