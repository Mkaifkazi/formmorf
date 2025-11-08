import { FormBuilder, FormViewer } from '@formmorf/builder'
import '@formmorf/builder/dist/style.css'
import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [schema, setSchema] = useState<any>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null)
  const [viewMode, setViewMode] = useState<'builder' | 'viewer'>('builder')

  const handleSchemaChange = (newSchema: any) => {
    console.log('Schema updated:', newSchema)
    setSchema(newSchema)
  }

  const handleSave = (savedSchema: any) => {
    console.log('Schema saved:', savedSchema)
    setNotification({ message: 'Form schema saved successfully!', type: 'success' })
  }

  const handleExportSchema = (exportedSchema: any) => {
    console.log('Exported Schema:', exportedSchema)

    // Download the schema as a JSON file
    const dataStr = JSON.stringify(exportedSchema, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

    const exportFileDefaultName = `form-schema-${Date.now()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    setNotification({ message: 'Schema exported as JSON file!', type: 'success' })
  }

  const handleFormSubmit = (values: Record<string, any>) => {
    console.log('Form submitted with values:', values)
    setNotification({ message: 'Form submitted successfully!', type: 'success' })
  }

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  return (
    <div className="app-container" style={{
      padding: '0',
      margin: '0',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid #e2e8f0',
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            FormMorf
            <span style={{
              fontSize: '12px',
              padding: '2px 8px',
              background: '#f0f9ff',
              color: '#3b82f6',
              borderRadius: '4px',
              fontWeight: '500'
            }}>
              v0.1.0
            </span>
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Drag & Drop Form Builder • 30+ Field Types • Real-time Preview • Export to JSON
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            color: '#64748b',
            fontSize: '13px',
            padding: '6px 12px',
            background: '#f1f5f9',
            borderRadius: '6px',
            fontWeight: '500'
          }}>
            {schema?.fields?.length || 0} fields
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'builder' ? 'viewer' : 'builder')}
            disabled={!schema || schema?.fields?.length === 0}
            style={{
              padding: '10px 20px',
              background: viewMode === 'builder'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: !schema || schema?.fields?.length === 0 ? 'not-allowed' : 'pointer',
              opacity: !schema || schema?.fields?.length === 0 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: !schema || schema?.fields?.length === 0
                ? 'none'
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (schema && schema?.fields?.length > 0) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = schema && schema?.fields?.length > 0
                ? '0 4px 12px rgba(0, 0, 0, 0.1)'
                : 'none';
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {viewMode === 'builder' ? (
                // Eye icon for preview
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ) : (
                // Edit icon
                <>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </>
              )}
            </svg>
            <span>{viewMode === 'builder' ? 'Preview Form' : 'Edit Form'}</span>
          </button>
        </div>
      </header>

      {/* Form Builder/Viewer Container */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {viewMode === 'builder' ? (
          <FormBuilder
            onChange={handleSchemaChange}
            onSave={handleSave}
            onExportSchema={handleExportSchema}
          />
        ) : (
          <div style={{
            height: '100%',
            overflow: 'auto',
            padding: '40px',
            background: '#f8fafc'
          }}>
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              background: 'white',
              borderRadius: '8px',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              {schema && (
                <FormViewer
                  schema={schema}
                  onSubmit={handleFormSubmit}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '12px 20px',
          background: notification.type === 'success' ? '#10b981' : '#3b82f6',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideUp 0.3s ease',
          zIndex: 1001
        }}>
          <span>{notification.type === 'success' ? '✓' : 'ℹ'}</span>
          {notification.message}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default App
