import React, { useState } from 'react';
import { DraggableField } from './DraggableField';
import { FIELD_CATEGORIES } from '../config/fieldConfig';
import { IconRenderer } from './IconRenderer';

export const ComponentPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(FIELD_CATEGORIES.map(cat => cat.name))
  );

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const filteredCategories = FIELD_CATEGORIES.map(category => ({
    ...category,
    fields: category.fields.filter(field =>
      field.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.fields.length > 0);

  return (
    <div className="component-panel">
      <div className="panel-header">
        <h3>Components</h3>
        <input
          type="text"
          placeholder="Search fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="field-categories">
        {filteredCategories.map((category) => (
          <div key={category.name} className="field-category">
            <button
              className="category-header"
              onClick={() => toggleCategory(category.name)}
              aria-expanded={expandedCategories.has(category.name)}
            >
              <IconRenderer icon={category.icon || 'folder'} className="category-icon" />
              <span className="category-name">{category.name}</span>
              <IconRenderer
                icon={expandedCategories.has(category.name) ? 'expand_more' : 'chevron_right'}
                className="category-toggle"
              />
            </button>

            {expandedCategories.has(category.name) && (
              <div className="category-fields">
                {category.fields.map((field) => (
                  <DraggableField
                    key={field.type}
                    fieldType={field.type}
                    label={field.label}
                    icon={field.icon}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};