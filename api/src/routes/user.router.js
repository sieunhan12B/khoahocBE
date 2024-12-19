import express from "express";
import {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  getUser,
} from "../controllers/user.controller.js";

const userRoutes = express.Router();

// userRoutes.post("/order", order);
userRoutes.get("/LayDanhSachNguoiDung", getUsers);
userRoutes.post("/ThemNguoiDung", addUser);
userRoutes.delete("/XoaNguoiDung/:taiKhoan", deleteUser);
userRoutes.put("/CapNhatThongTinNguoiDung", updateUser);
userRoutes.get("/LayThongTinNguoiDung/:taiKhoan", getUser);

export default userRoutes;
