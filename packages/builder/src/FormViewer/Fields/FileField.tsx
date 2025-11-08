import React, { useRef, useState, useCallback } from 'react';
import { BaseFieldProps } from './types';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  CloudUpload,
  AttachFile,
  Delete,
  Description,
  Image as ImageIcon,
  PictureAsPdf,
  InsertDriveFile,
} from '@mui/icons-material';

interface FileFieldProps extends BaseFieldProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  showPreview?: boolean;
  buttonText?: string;
  dragDropText?: string;
}

interface FileWithPreview {
  file: File;
  preview?: string;
}

export const FileField: React.FC<FileFieldProps> = ({
  id,
  name,
  label,
  helpText,
  required = false,
  disabled = false,
  readonly = false,
  value,
  error,
  accept,
  multiple = false,
  maxSize = 10,
  maxFiles = 10,
  showPreview = true,
  buttonText = 'Choose Files',
  dragDropText = 'or drag and drop files here',
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  // Generate preview for image files
  const generatePreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  }, []);

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File "${file.name}" exceeds maximum size of ${maxSize}MB`;
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        }
        if (type.endsWith('/*')) {
          return mimeType.startsWith(type.replace('/*', '/'));
        }
        return mimeType === type;
      });

      if (!isAccepted) {
        return `File type "${file.type}" is not accepted`;
      }
    }

    return null;
  }, [accept, maxSize]);

  // Handle file selection
  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    // Check max files limit
    const totalFiles = files.length + fileList.length;
    if (multiple && totalFiles > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Process each file
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
        continue;
      }

      // Generate preview if needed
      const preview = showPreview ? await generatePreview(file) : undefined;
      newFiles.push({ file, preview });
    }

    // Show errors if any
    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    // Update files
    if (newFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);

      // Call onChange with File or FileList
      if (multiple) {
        const fileList = updatedFiles.map(f => f.file);
        onChange?.(fileList);
      } else {
        onChange?.(newFiles[0].file);
      }
    }
  }, [files, multiple, maxFiles, showPreview, validateFile, generatePreview, onChange]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input to allow selecting same file again
    e.target.value = '';
  }, [handleFiles]);

  // Handle button click
  const handleButtonClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !readonly) {
      setIsDragging(true);
    }
  }, [disabled, readonly]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!disabled && !readonly) {
      handleFiles(e.dataTransfer.files);
    }
  }, [disabled, readonly, handleFiles]);

  // Remove file
  const handleRemoveFile = useCallback((index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    if (updatedFiles.length === 0) {
      onChange?.(null);
    } else if (multiple) {
      onChange?.(updatedFiles.map(f => f.file));
    } else {
      onChange?.(updatedFiles[0]?.file);
    }
  }, [files, multiple, onChange]);

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon />;
    if (file.type === 'application/pdf') return <PictureAsPdf />;
    if (file.type.startsWith('text/')) return <Description />;
    return <InsertDriveFile />;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box className="form-field form-field-file" sx={{ mb: 2 }}>
      {label && (
        <Typography
          component="label"
          htmlFor={fieldId}
          sx={{
            display: 'block',
            mb: 1,
            fontSize: '0.875rem',
            fontWeight: 500,
            color: error ? 'error.main' : 'text.primary'
          }}
        >
          {label}
          {required && <span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span>}
        </Typography>
      )}

      <Paper
        elevation={0}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: error ? '2px solid' : '2px dashed',
          borderColor: error
            ? 'error.main'
            : isDragging
              ? 'primary.main'
              : 'divider',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          backgroundColor: isDragging
            ? 'action.hover'
            : disabled
              ? 'action.disabledBackground'
              : 'background.paper',
          transition: 'all 0.2s',
          cursor: disabled || readonly ? 'not-allowed' : 'pointer',
          '&:hover': {
            borderColor: disabled || readonly ? 'divider' : 'primary.main',
            backgroundColor: disabled || readonly ? 'action.disabledBackground' : 'action.hover',
          }
        }}
      >
        <input
          ref={inputRef}
          id={fieldId}
          name={name}
          type="file"
          style={{ display: 'none' }}
          required={required && files.length === 0}
          disabled={disabled || readonly}
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
        />

        <CloudUpload sx={{ fontSize: 48, color: 'action.active', mb: 2 }} />

        <Button
          variant="contained"
          startIcon={<AttachFile />}
          onClick={handleButtonClick}
          disabled={disabled || readonly}
          sx={{ mb: 1 }}
        >
          {buttonText}
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {dragDropText}
        </Typography>

        {accept && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Accepted: {accept}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary">
          Max size: {maxSize}MB {multiple && `• Max files: ${maxFiles}`}
        </Typography>
      </Paper>

      {files.length > 0 && (
        <List sx={{ mt: 2 }}>
          {files.map((fileWithPreview, index) => (
            <ListItem
              key={index}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                backgroundColor: 'background.paper'
              }}
            >
              {showPreview && fileWithPreview.preview ? (
                <Box
                  component="img"
                  src={fileWithPreview.preview}
                  alt={fileWithPreview.file.name}
                  sx={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 1,
                    mr: 2
                  }}
                />
              ) : (
                <Box sx={{ mr: 2, color: 'action.active' }}>
                  {getFileIcon(fileWithPreview.file)}
                </Box>
              )}

              <ListItemText
                primary={fileWithPreview.file.name}
                secondary={formatFileSize(fileWithPreview.file.size)}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { maxWidth: '300px' }
                }}
              />

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveFile(index)}
                  disabled={disabled || readonly}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {helpText && !error && (
        <Typography
          id={`${fieldId}-help`}
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: 'block' }}
        >
          {helpText}
        </Typography>
      )}

      {error && (
        <Typography
          id={`${fieldId}-error`}
          variant="caption"
          color="error"
          role="alert"
          sx={{ mt: 0.5, display: 'block' }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};
