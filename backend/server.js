require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Database connected:', res.rows[0].now);
  }
});

// ============================================
// CLIENTS ENDPOINTS
// ============================================

// Get all clients
app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clients ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Error fetching clients' });
  }
});

// Get single client
app.get('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM clients WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Error fetching client' });
  }
});

// Create client
app.post('/api/clients', async (req, res) => {
  try {
    const { name, industry } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Client name is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO clients (name, industry) VALUES ($1, $2) RETURNING *',
      [name, industry]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Error creating client' });
  }
});

// Update client
app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, industry } = req.body;
    
    const result = await pool.query(
      'UPDATE clients SET name = $1, industry = $2 WHERE id = $3 RETURNING *',
      [name, industry, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Error updating client' });
  }
});

// Delete client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM clients WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Error deleting client' });
  }
});

// ============================================
// TEMPLATES ENDPOINTS
// ============================================

// Get all templates
app.get('/api/templates', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, c.name as client_name 
      FROM templates t
      LEFT JOIN clients c ON t.client_id = c.id
      ORDER BY t.updated_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Error fetching templates' });
  }
});

// Get templates by client
app.get('/api/clients/:clientId/templates', async (req, res) => {
  try {
    const { clientId } = req.params;
    const result = await pool.query(
      'SELECT * FROM templates WHERE client_id = $1 ORDER BY updated_at DESC',
      [clientId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching client templates:', error);
    res.status(500).json({ error: 'Error fetching client templates' });
  }
});

// Get single template
app.get('/api/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM templates WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Error fetching template' });
  }
});

// Create template
app.post('/api/templates', async (req, res) => {
  try {
    const { 
      client_id, 
      name, 
      description, 
      h1_bank, 
      h2_bank, 
      h3_bank, 
      descriptions,
      site_name,
      display_url
    } = req.body;
    
    if (!client_id || !name) {
      return res.status(400).json({ error: 'Client ID and template name are required' });
    }
    
    const result = await pool.query(`
      INSERT INTO templates 
      (client_id, name, description, h1_bank, h2_bank, h3_bank, descriptions, site_name, display_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *
    `, [
      client_id,
      name,
      description,
      h1_bank || [],
      h2_bank || [],
      h3_bank || [],
      descriptions || [],
      site_name,
      display_url
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Error creating template' });
  }
});

// Update template
app.put('/api/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      h1_bank, 
      h2_bank, 
      h3_bank, 
      descriptions,
      site_name,
      display_url
    } = req.body;
    
    const result = await pool.query(`
      UPDATE templates 
      SET name = $1, 
          description = $2, 
          h1_bank = $3, 
          h2_bank = $4, 
          h3_bank = $5, 
          descriptions = $6,
          site_name = $7,
          display_url = $8
      WHERE id = $9 
      RETURNING *
    `, [
      name,
      description,
      h1_bank,
      h2_bank,
      h3_bank,
      descriptions,
      site_name,
      display_url,
      id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Error updating template' });
  }
});

// Delete template
app.delete('/api/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM templates WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Error deleting template' });
  }
});

// ============================================
// GENERATED RSAs ENDPOINTS
// ============================================

// Get RSAs by template
app.get('/api/templates/:templateId/rsas', async (req, res) => {
  try {
    const { templateId } = req.params;
    const result = await pool.query(
      'SELECT * FROM generated_rsas WHERE template_id = $1 ORDER BY created_at DESC',
      [templateId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching RSAs:', error);
    res.status(500).json({ error: 'Error fetching RSAs' });
  }
});

// Save generated RSAs
app.post('/api/templates/:templateId/rsas', async (req, res) => {
  try {
    const { templateId } = req.params;
    const { rsas, site_name, display_url } = req.body;
    
    if (!rsas || !Array.isArray(rsas)) {
      return res.status(400).json({ error: 'RSAs array is required' });
    }
    
    // Insert multiple RSAs
    const insertPromises = rsas.map(rsa => {
      return pool.query(`
        INSERT INTO generated_rsas 
        (template_id, rsa_name, headlines, descriptions, site_name, display_url) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *
      `, [
        templateId,
        rsa.name,
        JSON.stringify(rsa.headlines),
        rsa.descriptions,
        site_name,
        display_url
      ]);
    });
    
    const results = await Promise.all(insertPromises);
    const savedRSAs = results.map(r => r.rows[0]);
    
    res.status(201).json(savedRSAs);
  } catch (error) {
    console.error('Error saving RSAs:', error);
    res.status(500).json({ error: 'Error saving RSAs' });
  }
});

// Mark RSA as exported
app.put('/api/rsas/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      UPDATE generated_rsas 
      SET exported = true, exported_at = NOW() 
      WHERE id = $1 
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'RSA not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking RSA as exported:', error);
    res.status(500).json({ error: 'Error marking RSA as exported' });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Google Ads RSA Simulator API - Arsen Web 3.0',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end();
  process.exit(0);
});
