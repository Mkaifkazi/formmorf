import React from 'react';
import { useFormStore } from '../store/formStore';

export const FormPropertiesTab: React.FC = () => {
  const { schema, updateFormSettings, updateFormMetadata } = useFormStore();

  // Use local state to handle input changes
  const [localTitle, setLocalTitle] = React.useState(schema.title);
  const [localDescription, setLocalDescription] = React.useState(schema.description || '');
  const [localSubmitText, setLocalSubmitText] = React.useState(schema.settings?.submitButtonText || 'Submit');
  const [localCancelText, setLocalCancelText] = React.useState(schema.settings?.cancelButtonText || 'Cancel');

  // Update local state when schema changes
  React.useEffect(() => {
    setLocalTitle(schema.title);
    setLocalDescription(schema.description || '');
    setLocalSubmitText(schema.settings?.submitButtonText || 'Submit');
    setLocalCancelText(schema.settings?.cancelButtonText || 'Cancel');
  }, [schema]);

  // Handle blur events to update store
  const handleTitleBlur = () => {
    updateFormMetadata({ title: localTitle });
  };

  const handleDescriptionBlur = () => {
    updateFormMetadata({ description: localDescription });
  };

  const handleSubmitTextBlur = () => {
    updateFormSettings({ submitButtonText: localSubmitText });
  };

  const handleCancelTextBlur = () => {
    updateFormSettings({ cancelButtonText: localCancelText });
  };

  return (
    <div className="form-properties">
      <div className="property-section">
        <h4>Form Settings</h4>

        <div className="property-group">
          <label className="property-label" htmlFor="form-title">Form Title</label>
          <input
            id="form-title"
            type="text"
            className="property-input"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={handleTitleBlur}
            placeholder="Enter form title"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="property-group">
          <label className="property-label" htmlFor="form-description">Description</label>
          <textarea
            id="form-description"
            className="property-textarea"
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Enter form description"
            rows={3}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="property-group">
          <label className="property-label" htmlFor="submit-text">Submit Button Text</label>
          <input
            id="submit-text"
            type="text"
            className="property-input"
            value={localSubmitText}
            onChange={(e) => setLocalSubmitText(e.target.value)}
            onBlur={handleSubmitTextBlur}
            placeholder="Submit button text"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="property-group">
          <label className="property-label" htmlFor="cancel-text">Cancel Button Text</label>
          <input
            id="cancel-text"
            type="text"
            className="property-input"
            value={localCancelText}
            onChange={(e) => setLocalCancelText(e.target.value)}
            onBlur={handleCancelTextBlur}
            placeholder="Cancel button text"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};