import { useState, useEffect } from 'react';
import { getClientTemplates, createTemplate, deleteTemplate } from '../lib/api';

export default function TemplateManager({ client, onReload }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (client) {
      loadTemplates();
    }
  }, [client]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await getClientTemplates(client.id);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error loading templates:', error);
      alert('Error al cargar templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('¿Estás seguro de eliminar este template?')) return;

    try {
      await deleteTemplate(templateId);
      alert('Template eliminado');
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Error al eliminar template');
    }
  };

  const handleLoadTemplate = (template) => {
    setSelectedTemplate(template);
    // Dispatch custom event to load template data
    window.dispatchEvent(new CustomEvent('loadTemplate', { detail: template }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          💾 Templates Guardados
        </h2>
        <button
          onClick={() => setShowSaveModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          + Guardar Template Actual
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay templates guardados para {client.name}</p>
          <p className="text-sm mt-2">Crea tu primer template usando el simulador abajo</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <h3 className="font-semibold text-gray-800 mb-2">
                📁 {template.name}
              </h3>
              {template.description && (
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              )}
              <div className="text-xs text-gray-500 mb-3 space-y-1">
                <p>• {template.h1_bank?.length || 0} H1 headlines</p>
                <p>• {template.h2_bank?.length || 0} H2 headlines</p>
                <p>• {template.h3_bank?.length || 0} H3 headlines</p>
                <p>• {template.descriptions?.length || 0} descriptions</p>
              </div>
              <div className="text-xs text-gray-400 mb-3">
                Actualizado: {new Date(template.updated_at).toLocaleDateString('es-MX')}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLoadTemplate(template)}
                  className="flex-1 px-3 py-1.5 bg-primary text-white text-sm rounded hover:bg-blue-700 transition"
                >
                  Cargar
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Guardar Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Template *
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Ej: Core Diagnóstico"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  placeholder="Ej: Template principal para servicios de diagnóstico"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setNewTemplateName('');
                  setNewTemplateDescription('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Dispatch event to save current template
                  window.dispatchEvent(new CustomEvent('saveTemplate', {
                    detail: {
                      name: newTemplateName,
                      description: newTemplateDescription,
                      clientId: client.id
                    }
                  }));
                  setShowSaveModal(false);
                  setNewTemplateName('');
                  setNewTemplateDescription('');
                }}
                disabled={!newTemplateName.trim()}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
