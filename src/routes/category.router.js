import express from "express";
import {
  getAllCategory,
  addCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller.js";
const categoryRouter = express.Router();

categoryRouter.get("/LayDanhSachDanhMuc", getAllCategory);
categoryRouter.post("/ThemDanhMuc", addCategory);
categoryRouter.delete("/XoaDanhMuc/:maDanhMuc", deleteCategory);
categoryRouter.put("/CapNhatDanhMuc", updateCategory);
export default categoryRouter;
