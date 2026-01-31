import { useState, useEffect } from 'react';
import { createTemplate, saveGeneratedRSAs } from '../lib/api';
import AdPreview from './AdPreview';

export default function StrategicBlocks({ client }) {
  const [h1Bank, setH1Bank] = useState('');
  const [h2Bank, setH2Bank] = useState('');
  const [h3Bank, setH3Bank] = useState('');
  const [descBank, setDescBank] = useState('');
  const [siteName, setSiteName] = useState('');
  const [displayUrl, setDisplayUrl] = useState('');
  
  const [generatedRSAs, setGeneratedRSAs] = useState([]);
  const [selectedRSAs, setSelectedRSAs] = useState(new Set());

  useEffect(() => {
    // Listen for load template event
    const handleLoadTemplate = (event) => {
      const template = event.detail;
      setH1Bank((template.h1_bank || []).join('\n'));
      setH2Bank((template.h2_bank || []).join('\n'));
      setH3Bank((template.h3_bank || []).join('\n'));
      setDescBank((template.descriptions || []).join('\n'));
      setSiteName(template.site_name || '');
      setDisplayUrl(template.display_url || '');
    };

    // Listen for save template event
    const handleSaveTemplate = async (event) => {
      const { name, description, clientId } = event.detail;
      await saveCurrentTemplate(name, description, clientId);
    };

    window.addEventListener('loadTemplate', handleLoadTemplate);
    window.addEventListener('saveTemplate', handleSaveTemplate);

    return () => {
      window.removeEventListener('loadTemplate', handleLoadTemplate);
      window.removeEventListener('saveTemplate', handleSaveTemplate);
    };
  }, [h1Bank, h2Bank, h3Bank, descBank, siteName, displayUrl]);

  const saveCurrentTemplate = async (name, description, clientId) => {
    try {
      const h1Array = h1Bank.split('\n').filter(l => l.trim()).map(l => l.trim().substring(0, 30));
      const h2Array = h2Bank.split('\n').filter(l => l.trim()).map(l => l.trim().substring(0, 30));
      const h3Array = h3Bank.split('\n').filter(l => l.trim()).map(l => l.trim().substring(0, 30));
      const descArray = descBank.split('\n').filter(l => l.trim()).map(l => l.trim().substring(0, 90));

      await createTemplate({
        client_id: clientId,
        name,
        description,
        h1_bank: h1Array,
        h2_bank: h2Array,
        h3_bank: h3Array,
        descriptions: descArray,
        site_name: siteName,
        display_url: displayUrl
      });

      alert('✅ Template guardado exitosamente');
      window.location.reload();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('❌ Error al guardar template');
    }
  };

  const countLines = (text) => {
    return text.split('\n').filter(line => line.trim().length > 0).length;
  };

  const generateRSAs = (count) => {
    const h1Array = h1Bank.split('\n').filter(l => l.trim()).map(l => l.trim().substring(0, 30));
    const h2Array = h2Bank.split('\n').filter(l => l.trim()).map(l => l.trim().substring(0, 30));
    const h3Array = h3Bank.split('\n').filter(l => l.trim()).map(l => l.trim().substring(0, 30));
    const descArray = descBank.split('\n').filter(l => l.trim()).map(l => l.trim().substring(0, 90));

    if (h1Array.length === 0 || h2Array.length === 0 || h3Array.length === 0) {
      alert('⚠️ Necesitas al menos 1 headline en cada banco (H1, H2, H3)');
      return;
    }

    if (descArray.length === 0) {
      alert('⚠️ Necesitas al menos 1 description');
      return;
    }

    const rsas = [];
    for (let i = 0; i < count; i++) {
      const rsa = generateSingleRSA(h1Array, h2Array, h3Array, descArray, i, count);
      rsas.push(rsa);
    }

    setGeneratedRSAs(rsas);
    // Select all by default
    setSelectedRSAs(new Set(rsas.map((_, i) => i)));
  };

  const generateSingleRSA = (h1Array, h2Array, h3Array, descArray, index, total) => {
    const h1PerRSA = Math.min(4, h1Array.length);
    const h2PerRSA = Math.min(4, h2Array.length);
    const h3PerRSA = Math.min(3, h3Array.length);

    const headlines = [];

    // Select H1s (4 max, first one pinned to position 1)
    const h1Start = (index * h1PerRSA) % h1Array.length;
    for (let i = 0; i < h1PerRSA; i++) {
      const h1 = h1Array[(h1Start + i) % h1Array.length];
      headlines.push({ text: h1, type: 'H1', pin: i === 0 ? 1 : null });
    }

    // Select H2s (4 max, no pinning)
    const h2Start = (index * h2PerRSA) % h2Array.length;
    for (let i = 0; i < h2PerRSA; i++) {
      const h2 = h2Array[(h2Start + i) % h2Array.length];
      headlines.push({ text: h2, type: 'H2', pin: null });
    }

    // Select H3s (3 max, first one pinned to position 3)
    const h3Start = (index * h3PerRSA) % h3Array.length;
    for (let i = 0; i < h3PerRSA; i++) {
      const h3 = h3Array[(h3Start + i) % h3Array.length];
      headlines.push({ text: h3, type: 'H3', pin: i === 0 ? 3 : null });
    }

    // Select descriptions (2 max)
    const descPerRSA = Math.min(2, descArray.length);
    const descStart = (index * descPerRSA) % descArray.length;
    const descriptions = [];
    for (let i = 0; i < descPerRSA; i++) {
      descriptions.push(descArray[(descStart + i) % descArray.length]);
    }

    return {
      name: `RSA ${index + 1}`,
      headlines,
      descriptions
    };
  };

  const toggleRSASelection = (index) => {
    const newSelected = new Set(selectedRSAs);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRSAs(newSelected);
  };

  const exportToCSV = () => {
    if (generatedRSAs.length === 0) {
      alert('⚠️ Genera RSAs primero');
      return;
    }

    const selected = generatedRSAs.filter((_, i) => selectedRSAs.has(i));
    
    if (selected.length === 0) {
      alert('⚠️ Selecciona al menos 1 RSA para exportar');
      return;
    }

    // Create CSV
    let csv = 'RSA Name,Campaign,Ad Group,';
    
    for (let i = 1; i <= 15; i++) {
      csv += `Headline ${i},Pin Pos ${i},`;
    }
    
    for (let i = 1; i <= 4; i++) {
      csv += `Description ${i},`;
    }
    
    csv += 'Site Name,Display URL,Final URL\n';

    selected.forEach(rsa => {
      csv += `"${rsa.name}",Campaign Name,Ad Group Name,`;
      
      for (let i = 0; i < 15; i++) {
        if (i < rsa.headlines.length) {
          const h = rsa.headlines[i];
          csv += `"${h.text.replace(/"/g, '""')}","${h.pin || ''}",`;
        } else {
          csv += `"","",`;
        }
      }
      
      for (let i = 0; i < 4; i++) {
        const desc = rsa.descriptions[i] || '';
        csv += `"${desc.replace(/"/g, '""')}",`;
      }
      
      csv += `"${siteName}","${displayUrl}",https://www.example.com\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `google-ads-rsas-${client.name}-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ ${selected.length} RSAs exportados exitosamente!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🎯 Simulador de Bloques Estratégicos
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Input Banks */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📌 BANCO H1 - Marca/Ubicación/Credenciales
            </label>
            <textarea
              value={h1Bank}
              onChange={(e) => setH1Bank(e.target.value)}
              placeholder={`Pega tus H1 aquí, uno por línea:\n\nClínica Dental en Cuernavaca\nDentista en Cuernavaca\nCentro Dental en Cuernavaca\n...`}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-600 mt-2">
              {countLines(h1Bank)} headlines detectados
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 BANCO H2 - Ganchos/Beneficios/Urgencia
            </label>
            <textarea
              value={h2Bank}
              onChange={(e) => setH2Bank(e.target.value)}
              placeholder={`Pega tus H2 aquí, uno por línea:\n\nDiagnóstico claro desde el inicio\nAtención dental con claridad\nEvita errores de diagnóstico\n...`}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-600 mt-2">
              {countLines(h2Bank)} headlines detectados
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💥 BANCO H3 - CTAs/Acciones
            </label>
            <textarea
              value={h3Bank}
              onChange={(e) => setH3Bank(e.target.value)}
              placeholder={`Pega tus H3 aquí, uno por línea:\n\nAgenda tu consulta\nReserva tu cita\nInicia tu diagnóstico\n...`}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-600 mt-2">
              {countLines(h3Bank)} headlines detectados
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 DESCRIPTIONS
            </label>
            <textarea
              value={descBank}
              onChange={(e) => setDescBank(e.target.value)}
              placeholder={`Pega tus descriptions aquí, una por línea (máx 90 chars c/u):\n\nClínica dental especializada con diagnóstico profesional...\nEspecialistas certificados. Atención estructurada...\n...`}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-600 mt-2">
              {countLines(descBank)} descriptions detectadas
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Ej: Healteeth Dental"
                maxLength="35"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">{siteName.length}/35</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display URL
              </label>
              <input
                type="text"
                value={displayUrl}
                onChange={(e) => setDisplayUrl(e.target.value)}
                placeholder="Ej: www.healteeth.com.mx"
                maxLength="35"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">{displayUrl.length}/35</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => generateRSAs(3)}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              🎲 Generar 3 RSAs
            </button>
            <button
              onClick={() => generateRSAs(5)}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              🎲 Generar 5 RSAs
            </button>
            <button
              onClick={() => generateRSAs(10)}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              🎲 Generar 10 RSAs
            </button>
          </div>
        </div>

        {/* Right: Generated RSAs Preview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            👁️ RSAs Generados ({generatedRSAs.length})
          </h3>
          
          {generatedRSAs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🎯</div>
              <p>Genera RSAs usando los bloques estratégicos</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {generatedRSAs.map((rsa, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 transition ${
                    selectedRSAs.has(index) ? 'border-primary bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-800">🎯 {rsa.name}</h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRSAs.has(index)}
                        onChange={() => toggleRSASelection(index)}
                        className="w-5 h-5"
                      />
                      <span className="text-sm">Incluir</span>
                    </label>
                  </div>

                  <div className="space-y-2 mb-3">
                    {rsa.headlines.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm bg-white px-2 py-1.5 rounded">
                        {h.pin && (
                          <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                            📌 Pos {h.pin}
                          </span>
                        )}
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          h.type === 'H1' ? 'bg-orange-100 text-orange-700' :
                          h.type === 'H2' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {h.type}
                        </span>
                        <span className="text-gray-700">{h.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Descriptions:</p>
                    {rsa.descriptions.map((d, i) => (
                      <p key={i} className="text-xs text-gray-600 mb-1">
                        <strong>D{i+1}:</strong> {d}
                      </p>
                    ))}
                  </div>

                  <div className="border-t pt-3">
                    <AdPreview 
                      headlines={rsa.headlines}
                      descriptions={rsa.descriptions}
                      siteName={siteName || 'Google Ads'}
                      displayUrl={displayUrl || 'www.example.com'}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {generatedRSAs.length > 0 && (
        <div className="flex gap-4 pt-6 border-t">
          <button
            onClick={exportToCSV}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            💾 Exportar {selectedRSAs.size} RSAs seleccionados a CSV
          </button>
          <button
            onClick={() => {
              setGeneratedRSAs([]);
              setSelectedRSAs(new Set());
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            🔄 Limpiar RSAs
          </button>
        </div>
      )}
    </div>
  );
}
