import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// Configure multer for sprite uploads
const spriteStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), 'public', 'sprites');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      cb(null, uploadsDir);
    } catch (error) {
      cb(error as Error, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    // Keep original filename
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: spriteStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/gif') {
      cb(null, true);
    } else {
      cb(new Error('Only GIF files are allowed'));
    }
  }
});

const TEAM_FILE_PATH = path.join(process.cwd(), "team-data.json");

export async function registerRoutes(app: Express): Promise<Server> {
  // Sprite upload endpoint
  app.post('/api/sprites/upload', upload.single('sprite'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      res.json({
        success: true,
        filename: req.file.filename,
        url: `/sprites/${req.file.filename}`
      });
    } catch (error) {
      console.error('Sprite upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // List uploaded sprites
  app.get('/api/sprites/list', async (req, res) => {
    try {
      const spritesDir = path.join(process.cwd(), 'public', 'sprites');
      const files = await fs.readdir(spritesDir);
      const sprites = files.filter(file => file.endsWith('.gif'));
      res.json({ sprites });
    } catch (error) {
      res.json({ sprites: [] });
    }
  });

  // Load team endpoint
  app.get("/api/team", async (req, res) => {
    try {
      const data = await fs.readFile(TEAM_FILE_PATH, "utf-8");
      res.json(JSON.parse(data));
    } catch (err) {
      // If file doesn't exist, return default team
      res.json({
        slots: [
          { slot: 1, coromon: null, potentLevel: "A", specialSkin: "None" },
          { slot: 2, coromon: null, potentLevel: "A", specialSkin: "None" },
          { slot: 3, coromon: null, potentLevel: "A", specialSkin: "None" },
          { slot: 4, coromon: null, potentLevel: "A", specialSkin: "None" },
          { slot: 5, coromon: null, potentLevel: "A", specialSkin: "None" },
          { slot: 6, coromon: null, potentLevel: "A", specialSkin: "None" },
        ],
      });
    }
  });

  // Save team endpoint
  app.post("/api/team", async (req, res) => {
    try {
      await fs.writeFile(TEAM_FILE_PATH, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (err) {
      console.error("Error saving team:", err);
      res.status(500).json({ error: "Failed to save team" });
    }
  });


  const httpServer = createServer(app);

  return httpServer;
}