import React from 'react';
import { useFormStore } from '../store/formStore';
import { DEVICE_BREAKPOINTS, DeviceType } from '../types';

export const DevicePreviewSwitcher: React.FC = () => {
  const { previewDevice, setPreviewDevice } = useFormStore();

  const devices: DeviceType[] = ['desktop', 'tablet', 'mobile'];

  // SVG icons for better visual distinction
  const getDeviceIcon = (device: DeviceType) => {
    switch (device) {
      case 'desktop':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'tablet':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <circle cx="12" cy="18" r="1" fill="currentColor" />
          </svg>
        );
      case 'mobile':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="7" y="2" width="10" height="20" rx="2" />
            <circle cx="12" cy="18" r="1" fill="currentColor" />
          </svg>
        );
    }
  };

  return (
    <div className="device-preview-switcher">
      {devices.map((device) => {
        const config = DEVICE_BREAKPOINTS[device];
        const isActive = previewDevice === device;

        return (
          <button
            key={device}
            className={`device-button ${isActive ? 'active' : ''}`}
            onClick={() => setPreviewDevice(device)}
            title={`${config.label} (${config.width}px)`}
          >
            <span className="device-icon">{getDeviceIcon(device)}</span>
            <span className="device-info">
              <span className="device-label">{config.label}</span>
              <span className="device-width">{config.width}px</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
