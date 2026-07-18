import { Router } from "express";
import { RepoController } from "./repo.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

// Protect all repo routes
router.use(authenticate);

router.post("/", RepoController.linkRepository);
router.get("/", RepoController.getRepositories);
router.put("/:id/primary", RepoController.setPrimary);
router.delete("/:id", RepoController.deleteRepository);

export default router;
