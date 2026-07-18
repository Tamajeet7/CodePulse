import { prisma } from "../../config/db";

export class RepoService {
  static async linkRepository(userId: string, name: string) {
    const cleanRepo = name.replace(/https:\/\/github\.com\//, "").trim();

    // Check if the user already has this repo
    const existing = await prisma.repository.findFirst({
      where: { userId, name: cleanRepo },
    });

    if (existing) {
      throw new Error("Repository is already linked to your account.");
    }

    // Check if it's their first repo. If so, make it primary.
    const count = await prisma.repository.count({ where: { userId } });
    const isPrimary = count === 0;

    const newRepo = await prisma.repository.create({
      data: {
        userId,
        name: cleanRepo,
        isPrimary,
      },
    });

    return newRepo;
  }

  static async getRepositories(userId: string) {
    return await prisma.repository.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async setPrimary(userId: string, repoId: string) {
    // First, unset all
    await prisma.repository.updateMany({
      where: { userId },
      data: { isPrimary: false },
    });

    // Then set the selected one
    const updated = await prisma.repository.update({
      where: { id: repoId },
      data: { isPrimary: true },
    });

    return updated;
  }

  static async deleteRepository(userId: string, repoId: string) {
    const repo = await prisma.repository.findUnique({ where: { id: repoId } });
    if (!repo || repo.userId !== userId) {
      throw new Error("Repository not found or unauthorized");
    }

    await prisma.repository.delete({
      where: { id: repoId },
    });

    if (repo.isPrimary) {
      // If they deleted the primary repo, try to make the next one primary
      const nextRepo = await prisma.repository.findFirst({ where: { userId } });
      if (nextRepo) {
        await prisma.repository.update({
          where: { id: nextRepo.id },
          data: { isPrimary: true },
        });
      }
    }

    return { success: true };
  }
}
