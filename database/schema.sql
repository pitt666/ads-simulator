-- Google Ads Simulator Database Schema
-- Arsen Web 3.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    h1_bank TEXT[] DEFAULT '{}', -- Array of H1 headlines
    h2_bank TEXT[] DEFAULT '{}', -- Array of H2 headlines
    h3_bank TEXT[] DEFAULT '{}', -- Array of H3 headlines
    descriptions TEXT[] DEFAULT '{}', -- Array of descriptions
    site_name VARCHAR(255),
    display_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Generated RSAs table (history)
CREATE TABLE generated_rsas (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
    rsa_name VARCHAR(255) NOT NULL,
    headlines JSONB NOT NULL, -- [{text, type, pin}, ...]
    descriptions TEXT[] NOT NULL,
    site_name VARCHAR(255),
    display_url VARCHAR(255),
    exported BOOLEAN DEFAULT FALSE,
    exported_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_templates_client ON templates(client_id);
CREATE INDEX idx_templates_updated ON templates(updated_at DESC);
CREATE INDEX idx_rsas_template ON generated_rsas(template_id);
CREATE INDEX idx_rsas_created ON generated_rsas(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample client
INSERT INTO clients (name, industry) VALUES 
    ('Healteeth Dental Center', 'Salud/Dental'),
    ('OptiSoft', 'Tecnología/SAP Consulting'),
    ('Rebal', 'Industrial/B2B');

-- Sample template
INSERT INTO templates (client_id, name, description, h1_bank, h2_bank, h3_bank, descriptions, site_name, display_url)
VALUES (
    1,
    'Core Diagnóstico',
    'Template principal para servicios de diagnóstico dental',
    ARRAY[
        'Clínica Dental en Cuernavaca',
        'Dentista en Cuernavaca',
        'Centro Dental en Cuernavaca',
        'Clínica Dental Certificada'
    ],
    ARRAY[
        'Diagnóstico claro desde el inicio',
        'Atención dental con claridad',
        'Evita errores de diagnóstico',
        '¿Necesitas atención dental ahora?'
    ],
    ARRAY[
        'Agenda tu consulta',
        'Reserva tu cita',
        'Inicia tu diagnóstico',
        'Consulta con especialistas'
    ],
    ARRAY[
        'Clínica dental especializada con diagnóstico profesional y plan claro desde la primera visita.',
        'Especialistas certificados. Atención estructurada y decisiones informadas.'
    ],
    'Healteeth Dental',
    'www.healteeth.com.mx'
);
