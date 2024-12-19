import express from "express";
import {
  register,
  login,
  getInfoUser,
  updateInfoUser,
  // loginFacebook,
  // extendToken,
} from "../controllers/auth.controller.js";
const authRouter = express.Router();
// register
authRouter.post("/DangKy", register);
authRouter.post("/DangNhap", login);
authRouter.post("/ThongTinTaiKhoan", getInfoUser);
authRouter.put("/CapNhatTaiKhoan", updateInfoUser);
// authRouter.post("/login-face", loginFacebook);
// authRouter.post("/extend-token", extendToken);
export default authRouter;
