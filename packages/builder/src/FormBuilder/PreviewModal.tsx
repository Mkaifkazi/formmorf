import React from 'react';
import { useFormStore } from '../store/formStore';
import { DevicePreviewSwitcher } from './DevicePreviewSwitcher';
import { FormViewer } from '../FormViewer/FormViewer';
import { IconRenderer } from './IconRenderer';
import './PreviewModal.css';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
  const { schema, previewDevice } = useFormStore();

  if (!isOpen) return null;

  const handleSubmit = (data: Record<string, any>) => {
    console.log('Preview form submitted:', data);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="preview-modal-overlay" onClick={handleOverlayClick}>
      <div className="preview-modal">
        <div className="preview-modal-header">
          <div className="preview-modal-title">
            <IconRenderer icon="visibility" size="medium" />
            <h3>Form Preview</h3>
          </div>
          <div className="preview-modal-controls">
            <DevicePreviewSwitcher />
            <button
              className="preview-close-button"
              onClick={onClose}
              title="Close Preview"
            >
              <IconRenderer icon="close" size="small" />
            </button>
          </div>
        </div>

        <div className="preview-modal-content">
          <div className={`preview-device-frame device-${previewDevice}`}>
            <FormViewer
              schema={schema}
              onSubmit={handleSubmit}
              className="preview-form"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
