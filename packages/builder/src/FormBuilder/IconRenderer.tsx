import React from 'react';
import * as Icons from '@mui/icons-material';

interface IconRendererProps {
  icon: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'disabled' | 'error';
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  icon,
  size = 'small',
  color = 'inherit',
  className = ''
}) => {
  // Map icon names to Material UI icons
  const iconMap: Record<string, React.ElementType> = {
    // Basic Input
    'text_fields': Icons.TextFields,
    'numbers': Icons.Numbers,
    'email': Icons.Email,
    'lock': Icons.Lock,
    'phone': Icons.Phone,
    'link': Icons.Link,
    'search': Icons.Search,
    'notes': Icons.Notes,

    // Choice
    'checklist': Icons.Checklist,
    'arrow_drop_down': Icons.ArrowDropDown,
    'check_box': Icons.CheckBox,
    'radio_button_checked': Icons.RadioButtonChecked,
    'toggle_on': Icons.ToggleOn,
    'star': Icons.Star,
    'tune': Icons.Tune,

    // Date & Time
    'event': Icons.Event,
    'calendar_today': Icons.CalendarToday,
    'access_time': Icons.AccessTime,
    'date_range': Icons.DateRange,

    // Rich Inputs
    'palette': Icons.Palette,
    'format_color_text': Icons.FormatColorText,
    'attach_file': Icons.AttachFile,
    'image': Icons.Image,
    'draw': Icons.Draw,

    // Layout & Display
    'dashboard': Icons.Dashboard,
    'title': Icons.Title,
    'subject': Icons.Subject,
    'horizontal_rule': Icons.HorizontalRule,
    'view_agenda': Icons.ViewAgenda,
    'warning': Icons.Warning,

    // Actions
    'drag_indicator': Icons.DragIndicator,
    'content_copy': Icons.ContentCopy,
    'delete': Icons.Delete,
    'close': Icons.Close,
    'add': Icons.Add,
    'remove': Icons.Remove,
    'settings': Icons.Settings,
    'save': Icons.Save,
    'upload': Icons.Upload,
    'download': Icons.Download,
    'undo': Icons.Undo,
    'redo': Icons.Redo,
    'preview': Icons.Preview,
    'code': Icons.Code,
    'expand_more': Icons.ExpandMore,
    'expand_less': Icons.ExpandLess,
    'chevron_right': Icons.ChevronRight,
    'visibility': Icons.Visibility,
    'visibility_off': Icons.VisibilityOff,
  };

  const IconComponent = iconMap[icon];

  if (!IconComponent) {
    // Fallback for unknown icons
    return <span className={className}>{icon}</span>;
  }

  return <IconComponent fontSize={size} color={color} className={className} />;
};