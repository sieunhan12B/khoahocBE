import express from "express";
import userRoutes from "./user.router.js";
import courseRoutes from "./course.router.js";
import authRouter from "./auth.router.js";
import categoryRouter from "./category.router.js";
import roleRouter from "./role.router.js";
// tạo object router tổng
const rootRoutes = express.Router();

rootRoutes.use("/QuanLyNguoiDung", userRoutes);
rootRoutes.use("/QuanLyKhoaHoc", courseRoutes);
rootRoutes.use("/Auth", authRouter);
rootRoutes.use("/QuanLyDanhMuc", categoryRouter);
rootRoutes.use("/QuanLyRole", roleRouter);
// export rootRoutes cho index.js dùng
export default rootRoutes;
