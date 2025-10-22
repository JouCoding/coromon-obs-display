import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { coromonList } from "@shared/coromon-data";

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

  // Scan sprites and update skins database
  app.post('/api/skins/scan', async (req, res) => {
    try {
      const spritesDir = path.join(process.cwd(), 'public', 'sprites');
      const files = await fs.readdir(spritesDir);
      const sprites = files.filter(file => file.endsWith('.gif'));

      await storage.clearAllSkins();

      interface SkinInfo {
        potentLevels: Set<string>;
        pattern: 'standard' | 'skin_potent' | 'potent_skin_front' | 'skin_front';
        sampleFile: string;
      }

      const skinMap = new Map<string, SkinInfo>();
      const knownCoromon = coromonList;

      for (const sprite of sprites) {
        const fileName = sprite.replace('.gif', '');
        const parts = fileName.split('_');
        
        if (fileName.endsWith('_front')) {
          const withoutFront = fileName.replace('_front', '');
          const frontParts = withoutFront.split('_');
          
          if (frontParts.length >= 2) {
            const coromonName = frontParts[0];
            
            if (frontParts.length === 3 && ['A', 'B', 'C'].includes(frontParts[1])) {
              const potentLevel = frontParts[1];
              const skinName = frontParts[2];
              const key = `${coromonName}:${skinName}`;
              
              if (!skinMap.has(key)) {
                skinMap.set(key, { potentLevels: new Set(), pattern: 'potent_skin_front', sampleFile: fileName });
              }
              skinMap.get(key)!.potentLevels.add(potentLevel);
            } else {
              const skinName = frontParts.slice(1).join('_');
              const key = `${coromonName}:${skinName}`;
              
              if (!skinMap.has(key)) {
                skinMap.set(key, { potentLevels: new Set(), pattern: 'skin_front', sampleFile: fileName });
              }
            }
          }
        } else {
          if (parts.length === 2 && ['A', 'B', 'C'].includes(parts[1])) {
            const coromonName = parts[0];
            const potentLevel = parts[1];
            const key = `${coromonName}:None`;
            
            if (!skinMap.has(key)) {
              skinMap.set(key, { potentLevels: new Set(), pattern: 'standard', sampleFile: fileName });
            }
            skinMap.get(key)!.potentLevels.add(potentLevel);
          } else if (parts.length === 3 && ['A', 'B', 'C'].includes(parts[2])) {
            let coromonName = parts[0];
            let skinName = parts[1];
            const potentLevel = parts[2];
            
            if (!knownCoromon.includes(coromonName) && knownCoromon.includes(parts[1])) {
              coromonName = parts[1];
              skinName = parts[0];
            }
            
            const key = `${coromonName}:${skinName}`;
            if (!skinMap.has(key)) {
              skinMap.set(key, { potentLevels: new Set(), pattern: 'skin_potent', sampleFile: fileName });
            }
            skinMap.get(key)!.potentLevels.add(potentLevel);
          }
        }
      }

      const insertedSkins = [];
      for (const entry of Array.from(skinMap.entries())) {
        const [key, info] = entry;
        const [coromonName, skinName] = key.split(':');
        const hasPotentVariant = info.potentLevels.size > 0;
        const potentLevelsArray: string[] = Array.from(info.potentLevels);

        const skin = await storage.upsertSkin({
          coromonName,
          skinName,
          potentLevels: potentLevelsArray,
          hasPotentVariant,
          pattern: info.pattern,
        });
        insertedSkins.push(skin);
      }

      res.json({
        success: true,
        skinsFound: insertedSkins.length,
        skins: insertedSkins,
      });
    } catch (error) {
      console.error('Skin scan error:', error);
      res.status(500).json({ error: 'Scan failed' });
    }
  });

  // Get all skins
  app.get('/api/skins', async (req, res) => {
    try {
      const allSkins = await storage.getAllSkins();
      res.json({ skins: allSkins });
    } catch (error) {
      console.error('Get skins error:', error);
      res.status(500).json({ error: 'Failed to get skins' });
    }
  });

  // Get skins for a specific Coromon
  app.get('/api/skins/:coromonName', async (req, res) => {
    try {
      const { coromonName } = req.params;
      const coromonSkins = await storage.getSkinsByCoromon(coromonName);
      res.json({ skins: coromonSkins });
    } catch (error) {
      console.error('Get Coromon skins error:', error);
      res.status(500).json({ error: 'Failed to get skins' });
    }
  });

  // Get profiles list
  app.get("/api/profiles", async (req, res) => {
    try {
      const profilesPath = path.join(process.cwd(), "profiles.json");
      const data = await fs.readFile(profilesPath, "utf-8");
      res.json(JSON.parse(data));
    } catch (err) {
      res.json({ profiles: ["default"] });
    }
  });

  // Save profiles list
  app.post("/api/profiles", async (req, res) => {
    try {
      const profilesPath = path.join(process.cwd(), "profiles.json");
      await fs.writeFile(profilesPath, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (err) {
      console.error("Error saving profiles:", err);
      res.status(500).json({ error: "Failed to save profiles" });
    }
  });

  // Load team for a specific profile
  app.get("/api/team/:profile", async (req, res) => {
    try {
      const { profile } = req.params;
      const teamPath = path.join(process.cwd(), `team-${profile}.json`);
      const data = await fs.readFile(teamPath, "utf-8");
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

  // Save team for a specific profile
  app.post("/api/team/:profile", async (req, res) => {
    try {
      const { profile } = req.params;
      const teamPath = path.join(process.cwd(), `team-${profile}.json`);
      await fs.writeFile(teamPath, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (err) {
      console.error("Error saving team:", err);
      res.status(500).json({ error: "Failed to save team" });
    }
  });

  // Delete team for a specific profile
  app.delete("/api/team/:profile", async (req, res) => {
    try {
      const { profile } = req.params;
      const teamPath = path.join(process.cwd(), `team-${profile}.json`);
      await fs.unlink(teamPath);
      res.json({ success: true });
    } catch (err) {
      res.json({ success: true }); // Don't error if file doesn't exist
    }
  });


  const httpServer = createServer(app);

  return httpServer;
}