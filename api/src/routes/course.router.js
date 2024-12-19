import express from "express";
import upload from "../utils/multer.js";
import {
  getCourse,
  addCourse,
  deleteCourse,
  updateCourse,
  getCourseById,
  getCourseByCategory,
  getCourseByName,
  getCourseByUserId,
} from "../controllers/course.controller.js";

const courseRoutes = express.Router();

courseRoutes.get("/LayDanhSachKhoaHoc", getCourse);
courseRoutes.post("/ThemKhoaHoc", upload.single("hinhAnh"), addCourse);
courseRoutes.delete("/XoaKhoaHoc/:maKhoaHoc", deleteCourse);
courseRoutes.put("/CapNhatKhoaHoc", upload.single("hinhAnh"), updateCourse);
courseRoutes.get("/LayThongTinKhoaHocTheoMaKhoaHoc/:maKhoaHoc", getCourseById);
courseRoutes.get(
  "/LayDanhSachKhoaHocTheoDanhMuc/:maDanhMuc",
  getCourseByCategory
);
courseRoutes.get(
  "/LayDanhSachKhoaHocTheoTenKhoaHoc/:tenKhoaHoc",
  getCourseByName
);
courseRoutes.get(
  "/LayDanhSachKhoaHocTheoMaNguoiDung/:maNguoiDung",
  getCourseByUserId
);

export default courseRoutes;
