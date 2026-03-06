const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/env');
const fs = require('fs');
const { initializeSchema } = require('./db/database');

// Middleware
const authMiddleware = require('./middleware/auth.middleware');
const errorHandler = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const petsRoutes = require('./routes/pets.routes');
const likesRoutes = require('./routes/likes.routes');

const app = express();

// Asegurar que el directorio de uploads exista antes de que Multer intente escribir
const uploadsDir = config.UPLOAD_DIR;
const petsUploadsDir = path.join(uploadsDir, 'pets');
try {
  fs.mkdirSync(petsUploadsDir, { recursive: true });
  console.log(`Uploads directory ready: ${petsUploadsDir}`);
} catch (err) {
  console.error('Failed to ensure uploads directory:', err);
  process.exit(1);
}

// ===== MIDDLEWARE GLOBAL =====
app.use(cors({
  // allow the frontend host defined in env (can be a comma-separated list if needed)
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [config.FRONTEND_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Anonymous-Id'],
  exposedHeaders: ['X-Anonymous-Id'],
  optionsSuccessStatus: 200,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir uploads estáticamente
app.use('/uploads', express.static(path.join(config.UPLOAD_DIR)));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== API ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/likes', likesRoutes);

// ===== ERROR HANDLING (DEBE SER ÚLTIMO) =====
app.use(errorHandler);

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
  });
});

// ===== START SERVER =====
(async () => {
  try {
    // Inicializar BD
    await initializeSchema();
    console.log('✅ Database initialized');

    // Iniciar servidor
    app.listen(config.PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🐶 PetsHub API Server                ║
║   Environment: ${config.NODE_ENV.padEnd(15)} ║
║   Port: ${config.PORT.toString().padEnd(29)} ║
║   Base URL: ${config.BASE_URL.padEnd(29)} ║
║   API: ${config.BASE_URL}/api               ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

module.exports = app;
