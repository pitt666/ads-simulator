import { useState, useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import StrategicBlocks from '../components/StrategicBlocks';
import TemplateManager from '../components/TemplateManager';
import { getClients } from '../lib/api';

export default function Home() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await getClients();
      setClients(response.data);
      if (response.data.length > 0) {
        setSelectedClient(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Google Ads RSA Simulator - Arsen Web 3.0</title>
        <meta name="description" content="Simulador de RSAs para Google Ads" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-primary">
              🎯 Google Ads RSA Simulator
            </h1>
            <p className="text-sm text-secondary mt-2">
              Herramienta interna de Arsen Web 3.0 - Previsualiza y gestiona tus RSAs
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-secondary">Cargando...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {/* Client Selector */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente:
                </label>
                <select
                  value={selectedClient?.id || ''}
                  onChange={(e) => {
                    const client = clients.find(c => c.id === parseInt(e.target.value));
                    setSelectedClient(client);
                  }}
                  className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.industry ? `(${client.industry})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Manager */}
              {selectedClient && (
                <TemplateManager 
                  client={selectedClient}
                  onReload={loadClients}
                />
              )}

              {/* Strategic Blocks Simulator */}
              {selectedClient && (
                <StrategicBlocks client={selectedClient} />
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-secondary">
            <p>© 2026 Arsen Web 3.0 - Google Ads RSA Simulator v1.0</p>
          </div>
        </footer>
      </div>
    </>
  );
}
