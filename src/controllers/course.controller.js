import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import { Op } from "sequelize";
import fs from "fs";

const model = initModels(sequelize);

//Lấy tất cả khóa học
const getCourse = async (req, res) => {
  try {
    // Fetch all users from the database
    const listCourse = await model.khoaHoc.findAll();
    console.log(listCourse);
    // Check if the list is empty
    if (listCourse.length === 0) {
      return res.status(404).json({ message: "No course found" });
    }

    res.status(200).json({ message: "success", data: listCourse });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(400).json({ message: "Error fetching course" });
  }
};

// Xóa khóa học
const deleteCourse = async (req, res) => {
  console.log(req, "req");
  try {
    let { maKhoaHoc } = req.params;
    console.log(maKhoaHoc, "maKhoaHoc");
    console.log("maKhoaHoc", maKhoaHoc);
    let course = await model.khoaHoc.findByPk(maKhoaHoc);
    console.log("course", course);

    if (!course) {
      return res.status(404).json({ message: "Khóa học không tồn tại" });
    }
    console.log(course.hinhAnh, "course.hinhAnh");
    // Xóa ảnh nếu có
    if (course.hinhAnh) {
      deleteUploadedFile("public/image/" + course.hinhAnh);
    }

    // Xóa các khóa ngoại trước (if needed)
    // await model.khoaHoc.destroy({ where: { maDanhMuc: maKhoaHoc } });
    // await model.khoaHoc.destroy({ where: { nguoiTao: maKhoaHoc } });

    // Sau đó xóa khóa học
    await model.khoaHoc.destroy({ where: { maKhoaHoc: maKhoaHoc } });
    return res.status(200).json({ message: "Xóa khóa học thành công!" }); // Removed redundant 'res' from response
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error deleting course", error: error.message }); // More descriptive error message
  }
};

const deleteUploadedFile = (filePath) => {
  if (filePath) {
    fs.unlinkSync(filePath);
  }
};

//Thêm khóa học
const addCourse = async (req, res) => {
  try {
    const { maKhoaHoc, tenKhoaHoc, moTa, giaTien, nguoiTao, loaiDanhMuc } =
      req.body;
    const hinhAnh = req.file ? req.file.filename : null; // Đường dẫn đến hình ảnh
    console.log(req, "req");
    console.log(req.file, "req.file");
    // Kiểm tra xem người dùng có tồn tại không
    const userExist = await model.user.findOne({
      where: { taiKhoan: nguoiTao },
    });
    const khoaHocExist = await model.khoaHoc.findOne({ where: { maKhoaHoc } });

    if (khoaHocExist) {
      deleteUploadedFile(req.file?.path); // Xóa file nếu đã tồn tại
      return res
        .status(400)
        .json({ message: "Mã khóa học đã tồn tại", data: null });
    }

    if (
      !maKhoaHoc ||
      !tenKhoaHoc ||
      !moTa ||
      !giaTien ||
      !loaiDanhMuc ||
      !nguoiTao ||
      !hinhAnh
    ) {
      deleteUploadedFile(req.file?.path); // Xóa file nếu trường không hợp lệ
      return res.status(400).json({
        message:
          "Các trường maKhoaHoc, tenKhoaHoc, moTa, giaTien, loaiDanhMuc không được để trống",
        data: null,
      });
    }

    if (!userExist) {
      deleteUploadedFile(req.file?.path); // Xóa file nếu người dùng không tồn tại
      return res
        .status(400)
        .json({ message: "Người dùng không tồn tại", data: null });
    }

    // Tạo khóa học mới
    const newCourse = await model.khoaHoc.create({
      maKhoaHoc,
      tenKhoaHoc,
      moTa,
      hinhAnh,
      giaTien,
      nguoiTao,
      loaiDanhMuc,
      ngayTao: new Date(),
    });

    return res.status(200).json({ message: "success", data: newCourse });
  } catch (err) {
    console.error(err); // Log lỗi
    return res
      .status(400)
      .json({ message: "Fail to create course", error: err.message });
  }
};

//Cập nhật khóa học
const updateCourse = async (req, res) => {
  try {
    const { maKhoaHoc, tenKhoaHoc, moTa, giaTien, loaiDanhMuc } = req.body;
    console.log(req.file.filename, "req.file");
    const hinhAnh = req.file ? req.file.filename : null; // Đường dẫn đến hình ảnh mới

    // Kiểm tra xem khóa học có tồn tại không
    let course = await model.khoaHoc.findByPk(maKhoaHoc);
    if (!course) {
      return res.status(404).json({ message: "Khóa học không tồn tại" });
    }

    // Kiểm tra các trường cần thiết
    if (!tenKhoaHoc || !moTa || !giaTien || !loaiDanhMuc) {
      return res.status(400).json({
        message:
          "Các trường tenKhoaHoc, moTa, giaTien, loaiDanhMuc không được để trống",
        data: null,
      });
    }

    // Xóa ảnh cũ nếu có
    if (course.hinhAnh) {
      deleteUploadedFile("public/image/" + course.hinhAnh);
    }

    // Cập nhật khóa học
    await model.khoaHoc.update(
      {
        tenKhoaHoc,
        moTa,
        hinhAnh: hinhAnh,
        giaTien,
        loaiDanhMuc,
      },
      { where: { maKhoaHoc } }
    );

    // Lấy lại thông tin khóa học đã cập nhật
    course = await model.khoaHoc.findByPk(maKhoaHoc);
    return res.status(200).json({ message: "success", data: course });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

//Lấy danh mục khóa học

//Lấy danh sách khóa học theo danh mục
const getCourseByCategory = async (req, res) => {
  try {
    const { maDanhMuc } = req.params;
    const listCourse = await model.khoaHoc.findAll({
      where: { loaiDanhMuc: maDanhMuc },
      include: [
        {
          model: model.danhMucKhoaHoc,
          as: "danhMuc",
          attributes: ["tenDanhMuc"],
        },
      ],
    });
    return res.status(200).json({ message: "success", data: listCourse });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

//Lấy thông tin khóa học theo maKhoaHoc
const getCourseById = async (req, res) => {
  try {
    const { maKhoaHoc } = req.params;
    const course = await model.khoaHoc.findByPk(maKhoaHoc);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Khóa học không tồn tại", data: null });
    }
    return res.status(200).json({ message: "success", data: course });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

//Lấy danh sách khóa học theo tên khóa học
const getCourseByName = async (req, res) => {
  try {
    const { tenKhoaHoc } = req.params;
    const listCourse = await model.khoaHoc.findAll({
      where: { tenKhoaHoc: { [Op.like]: `%${tenKhoaHoc}%` } },
    });
    return res.status(200).json({ message: "success", data: listCourse });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

//Lấy danh sách khóa học theo maNguoiDung
const getCourseByUserId = async (req, res) => {
  try {
    const { maNguoiDung } = req.params;
    const listCourse = await model.khoaHoc.findAll({
      where: { nguoiTao: maNguoiDung },
    });
    return res.status(200).json({ message: "success", data: listCourse });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

export {
  getCourse,
  addCourse,
  deleteCourse,
  updateCourse,
  getCourseByCategory,
  getCourseById,
  getCourseByName,
  getCourseByUserId,
};
