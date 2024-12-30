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
  getCourseByTeacher,
  getCourseByStudent,
  addCoursesToStudent,
  getCourseByKeyword,
} from "../controllers/course.controller.js";

const courseRoutes = express.Router();

courseRoutes.get("/LayDanhSachKhoaHoc", getCourse);
courseRoutes.post("/ThemKhoaHoc", upload.single("image"), addCourse);
courseRoutes.delete("/XoaKhoaHoc/:courseId", deleteCourse);
courseRoutes.put("/CapNhatKhoaHoc", upload.single("image"), updateCourse);
courseRoutes.get("/LayThongTinKhoaHocTheoMaKhoaHoc/:courseId", getCourseById);
courseRoutes.get(
  "/LayDanhSachKhoaHocTheoDanhMuc/:categoryId",
  getCourseByCategory
);
courseRoutes.get(
  "/LayDanhSachKhoaHocTheoTenKhoaHoc/:courseName",
  getCourseByName
);
courseRoutes.get(
  "/LayDanhSachKhoaHocTheoMaGiangVien/:userId",
  getCourseByTeacher
);
courseRoutes.get(
  "/LayDanhSachKhoaHocTheoMaHocVien/:userId",
  getCourseByStudent
);
courseRoutes.get(
  "/LayDanhSachKhoaHocTheoTuKhoaTimKiem/:keyword",
  getCourseByKeyword
);
courseRoutes.post("/DangKyKhoaHoc", addCoursesToStudent);

export default courseRoutes;
