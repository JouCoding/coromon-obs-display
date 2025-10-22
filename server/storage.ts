import { users, skins, type User, type InsertUser, type Skin, type InsertSkin } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllSkins(): Promise<Skin[]>;
  getSkinsByCoromon(coromonName: string): Promise<Skin[]>;
  upsertSkin(skin: InsertSkin): Promise<Skin>;
  clearAllSkins(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllSkins(): Promise<Skin[]> {
    return await db.select().from(skins);
  }

  async getSkinsByCoromon(coromonName: string): Promise<Skin[]> {
    return await db.select().from(skins).where(eq(skins.coromonName, coromonName));
  }

  async upsertSkin(skin: InsertSkin): Promise<Skin> {
    const existing = await db
      .select()
      .from(skins)
      .where(
        and(
          eq(skins.coromonName, skin.coromonName),
          eq(skins.skinName, skin.skinName)
        )
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(skins)
        .set(skin)
        .where(eq(skins.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [inserted] = await db
        .insert(skins)
        .values(skin)
        .returning();
      return inserted;
    }
  }

  async clearAllSkins(): Promise<void> {
    await db.delete(skins);
  }
}

export const storage = new DatabaseStorage();
