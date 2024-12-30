import express from "express";

import { getRoles } from "../controllers/role.controller.js";

const roleRouter = express.Router();

// userRoutes.post("/order", order);

roleRouter.get("/LayDanhSachRole", getRoles);

export default roleRouter;
