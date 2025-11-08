import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { BaseFieldProps } from './types';
import {
  Box,
  Paper,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Toolbar,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Link as LinkIcon,
  Title,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatClear,
} from '@mui/icons-material';

interface RichTextFieldProps extends BaseFieldProps {
  minHeight?: number;
  maxHeight?: number;
}

type FormatCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikeThrough'
  | 'insertOrderedList'
  | 'insertUnorderedList'
  | 'justifyLeft'
  | 'justifyCenter'
  | 'justifyRight'
  | 'formatBlock'
  | 'removeFormat'
  | 'createLink'
  | 'insertHTML';

export const RichTextField: React.FC<RichTextFieldProps> = ({
  id,
  name,
  label,
  placeholder,
  helpText,
  required = false,
  disabled = false,
  readonly = false,
  value = '',
  error,
  minHeight = 200,
  maxHeight = 500,
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value as string || '';
    }
  }, [value]);

  // Update active formats based on cursor position
  const updateActiveFormats = useCallback(() => {
    const formats: string[] = [];

    if (document.queryCommandState('bold')) formats.push('bold');
    if (document.queryCommandState('italic')) formats.push('italic');
    if (document.queryCommandState('underline')) formats.push('underline');
    if (document.queryCommandState('strikeThrough')) formats.push('strikeThrough');
    if (document.queryCommandState('insertOrderedList')) formats.push('insertOrderedList');
    if (document.queryCommandState('insertUnorderedList')) formats.push('insertUnorderedList');

    setActiveFormats(formats);
  }, []);

  // Debounced input handler for performance
  const handleInput = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      if (editorRef.current) {
        onChange?.(editorRef.current.innerHTML);
      }
    }, 300); // 300ms debounce
  }, [onChange]);

  // Execute formatting command
  const executeCommand = useCallback((command: FormatCommand, value?: string) => {
    if (command === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else if (command === 'formatBlock') {
      document.execCommand(command, false, value);
    } else if (command === 'insertHTML') {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false, undefined);
    }

    editorRef.current?.focus();
    updateActiveFormats();

    // Trigger immediate update for formatting changes
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  }, [onChange, updateActiveFormats]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
      }
    }
  }, [executeCommand]);

  // Memoized toolbar configuration
  type ToolbarButton = {
    command: FormatCommand;
    icon: React.ReactElement;
    label: string;
  } | {
    command: FormatCommand;
    icon: React.ReactElement;
    label: string;
    custom: true;
    value: string;
  };

  const toolbarConfig = useMemo(() => [
    {
      group: 'text',
      buttons: [
        { command: 'bold' as FormatCommand, icon: <FormatBold />, label: 'Bold (Ctrl+B)' },
        { command: 'italic' as FormatCommand, icon: <FormatItalic />, label: 'Italic (Ctrl+I)' },
        { command: 'underline' as FormatCommand, icon: <FormatUnderlined />, label: 'Underline (Ctrl+U)' },
        { command: 'strikeThrough' as FormatCommand, icon: <FormatStrikethrough />, label: 'Strikethrough' },
      ] as ToolbarButton[]
    },
    {
      group: 'heading',
      buttons: [
        {
          command: 'formatBlock' as FormatCommand,
          value: 'h1',
          icon: <Title sx={{ fontSize: '1.2rem' }} />,
          label: 'Heading 1',
          custom: true as const
        },
        {
          command: 'formatBlock' as FormatCommand,
          value: 'h2',
          icon: <Title sx={{ fontSize: '1rem' }} />,
          label: 'Heading 2',
          custom: true as const
        },
        {
          command: 'formatBlock' as FormatCommand,
          value: 'h3',
          icon: <Title sx={{ fontSize: '0.9rem' }} />,
          label: 'Heading 3',
          custom: true as const
        },
      ] as ToolbarButton[]
    },
    {
      group: 'list',
      buttons: [
        { command: 'insertUnorderedList' as FormatCommand, icon: <FormatListBulleted />, label: 'Bullet List' },
        { command: 'insertOrderedList' as FormatCommand, icon: <FormatListNumbered />, label: 'Numbered List' },
      ] as ToolbarButton[]
    },
    {
      group: 'align',
      buttons: [
        { command: 'justifyLeft' as FormatCommand, icon: <FormatAlignLeft />, label: 'Align Left' },
        { command: 'justifyCenter' as FormatCommand, icon: <FormatAlignCenter />, label: 'Align Center' },
        { command: 'justifyRight' as FormatCommand, icon: <FormatAlignRight />, label: 'Align Right' },
      ] as ToolbarButton[]
    },
    {
      group: 'insert',
      buttons: [
        { command: 'createLink' as FormatCommand, icon: <LinkIcon />, label: 'Insert Link', custom: true as const, value: '' },
        {
          command: 'insertHTML' as FormatCommand,
          value: '<blockquote style="border-left: 3px solid #ccc; padding-left: 12px; margin-left: 0;">Quote</blockquote>',
          icon: <FormatQuote />,
          label: 'Quote',
          custom: true as const
        },
        {
          command: 'insertHTML' as FormatCommand,
          value: '<pre style="background: #f5f5f5; padding: 8px; border-radius: 4px; overflow-x: auto;"><code>code</code></pre>',
          icon: <Code />,
          label: 'Code Block',
          custom: true as const
        },
      ] as ToolbarButton[]
    },
    {
      group: 'clear',
      buttons: [
        { command: 'removeFormat' as FormatCommand, icon: <FormatClear />, label: 'Clear Formatting', custom: true as const, value: '' },
      ] as ToolbarButton[]
    }
  ], []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box className="form-field form-field-richtext" sx={{ mb: 2 }}>
      {label && (
        <Box
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
        </Box>
      )}

      <Paper
        elevation={0}
        sx={{
          border: error ? '2px solid' : '1px solid',
          borderColor: error ? 'error.main' : isFocused ? 'primary.main' : 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: isFocused ? '0 0 0 3px rgba(25, 118, 210, 0.12)' : 'none',
          backgroundColor: disabled ? 'action.disabledBackground' : 'background.paper',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {!readonly && !disabled && (
          <>
            <Toolbar
              variant="dense"
              sx={{
                minHeight: 48,
                px: 1,
                gap: 0.5,
                flexWrap: 'wrap',
                backgroundColor: 'grey.50',
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              {toolbarConfig.map((group, groupIndex) => (
                <React.Fragment key={group.group}>
                  {groupIndex > 0 && (
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                  )}
                  <ToggleButtonGroup
                    size="small"
                    value={activeFormats}
                    aria-label="text formatting"
                    sx={{ gap: 0.25 }}
                  >
                    {group.buttons.map((btn) => (
                      <Tooltip key={btn.label} title={btn.label} arrow>
                        <ToggleButton
                          value={'custom' in btn ? btn.command : btn.command}
                          onClick={() => executeCommand(btn.command, 'value' in btn ? btn.value : undefined)}
                          selected={'custom' in btn ? false : activeFormats.includes(btn.command)}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            width: 36,
                            height: 36,
                            '&.Mui-selected': {
                              backgroundColor: 'primary.light',
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'primary.light',
                              }
                            }
                          }}
                        >
                          {btn.icon}
                        </ToggleButton>
                      </Tooltip>
                    ))}
                  </ToggleButtonGroup>
                </React.Fragment>
              ))}
            </Toolbar>
          </>
        )}

        <Box
          ref={editorRef}
          contentEditable={!disabled && !readonly}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            updateActiveFormats();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          aria-required={required}
          sx={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
            p: 2,
            overflowY: 'auto',
            outline: 'none',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            color: disabled ? 'text.disabled' : 'text.primary',
            fontFamily: 'inherit',
            '&:empty:before': {
              content: `"${placeholder || 'Start typing...'}"`,
              color: 'text.disabled',
              pointerEvents: 'none',
            },
            '& h1': {
              fontSize: '2rem',
              fontWeight: 600,
              margin: '16px 0 8px',
              lineHeight: 1.2,
            },
            '& h2': {
              fontSize: '1.5rem',
              fontWeight: 600,
              margin: '12px 0 6px',
              lineHeight: 1.3,
            },
            '& h3': {
              fontSize: '1.25rem',
              fontWeight: 600,
              margin: '10px 0 5px',
              lineHeight: 1.4,
            },
            '& p': {
              margin: '8px 0',
            },
            '& ul, & ol': {
              paddingLeft: '24px',
              margin: '8px 0',
            },
            '& li': {
              margin: '4px 0',
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none',
              }
            },
            '& blockquote': {
              borderLeft: '3px solid',
              borderColor: 'divider',
              paddingLeft: '12px',
              margin: '12px 0',
              color: 'text.secondary',
              fontStyle: 'italic',
            },
            '& pre': {
              backgroundColor: 'grey.100',
              padding: '12px',
              borderRadius: '4px',
              overflowX: 'auto',
              fontSize: '0.8125rem',
              fontFamily: 'monospace',
              margin: '12px 0',
            },
            '& code': {
              fontFamily: 'monospace',
              fontSize: '0.8125rem',
            },
            // Custom scrollbar
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'grey.100',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'grey.400',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'grey.500',
              }
            }
          }}
        />
      </Paper>

      {helpText && !error && (
        <Box
          id={`${fieldId}-help`}
          sx={{
            mt: 0.5,
            fontSize: '0.75rem',
            color: 'text.secondary'
          }}
        >
          {helpText}
        </Box>
      )}

      {error && (
        <Box
          id={`${fieldId}-error`}
          role="alert"
          sx={{
            mt: 0.5,
            fontSize: '0.75rem',
            color: 'error.main'
          }}
        >
          {error}
        </Box>
      )}
    </Box>
  );
};
