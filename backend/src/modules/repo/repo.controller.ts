import { Request, Response } from "express";
import { RepoService } from "./repo.service";

export class RepoController {
  static async linkRepository(req: Request, res: Response) {
    try {
      // Access req.user added by auth middleware
      const userId = (req as any).user.id;
      const { name } = req.body;

      if (!name) {
        throw new Error("Repository name is required (e.g. owner/repo)");
      }

      const repo = await RepoService.linkRepository(userId, name);
      res.status(201).json({ success: true, data: repo });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getRepositories(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const repos = await RepoService.getRepositories(userId);
      res.json({ success: true, data: repos });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async setPrimary(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const repoId = req.params.id as string;
      const updated = await RepoService.setPrimary(userId, repoId);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteRepository(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const repoId = req.params.id as string;
      await RepoService.deleteRepository(userId, repoId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
