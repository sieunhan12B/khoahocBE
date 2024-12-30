import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
// import bcrypt from "bcrypt";
import { Op } from "sequelize";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import transporter from "../config/transporter.js";
// import { createRefToken, createToken } from "../config/jwt.js";

const model = initModels(sequelize);

const getAllCategory = async (req, res) => {
  try {
    const categories = await model.courseCategory.findAll();
    return res.status(200).json({ message: "success", data: categories });
  } catch (error) {
    return res.status(400).json({ message: "error", error: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const { categoryId, categoryName } = req.body;
    // Kiểm tra rỗng
    if (!categoryId || !categoryName) {
      return res
        .status(400)
        .json({ message: "categoryId và categoryName không được để trống" });
    }
    const categoryExist = await model.courseCategory.findOne({
      where: { categoryId },
    });
    if (categoryExist) {
      return res.status(400).json({ message: "Danh mục đã tồn tại" });
    }
    const newCategory = await model.courseCategory.create({
      categoryId,
      categoryName,
    });
    return res.status(200).json({ message: "success", data: newCategory });
  } catch (error) {
    return res.status(400).json({ message: "error", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const categoryExist = await model.courseCategory.findOne({
      where: { categoryId },
    });
    if (!categoryExist) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }

    // Kiểm tra xem khóa học có học viên đăng ký không
    const enrolledCaegory = await model.course.findAll({
      where: { categoryId },
    });

    if (enrolledCaegory.length > 0) {
      return res
        .status(400)
        .json({ message: "Danh mục này đã có khóa học đăn kí, không thể xóa" });
    }

    // xóa khóa ngoại trước khi xóa danh mục
    // await model.course.destroy({ where: { categoryId: categoryId } });
    await model.courseCategory.destroy({ where: { categoryId } });
    return res.status(200).json({ message: "Xóa danh mục thành công!" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Xóa danh mục thất bại", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryId, categoryName } = req.body;
    // Kiểm tra rỗng
    if (!categoryId || !categoryName) {
      return res
        .status(400)
        .json({ message: "categoryId và categoryName không được để trống" });
    }
    const categoryExist = await model.courseCategory.findOne({
      where: { categoryId },
    });
    if (!categoryExist) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }
    await model.courseCategory.update(
      { categoryName },
      { where: { categoryId } }
    );
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(400).json({ message: "error", error: error.message });
  }
};

export { getAllCategory, addCategory, deleteCategory, updateCategory };
