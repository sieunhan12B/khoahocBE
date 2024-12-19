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
    const categories = await model.danhMucKhoaHoc.findAll();
    return res.status(200).json({ message: "success", data: categories });
  } catch (error) {
    return res.status(400).json({ message: "error", error: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const { maDanhMuc, tenDanhMuc } = req.body;
    const categoryExist = await model.danhMucKhoaHoc.findOne({
      where: { maDanhMuc },
    });
    if (categoryExist) {
      return res.status(400).json({ message: "Danh mục đã tồn tại" });
    }
    const newCategory = await model.danhMucKhoaHoc.create({
      maDanhMuc,
      tenDanhMuc,
    });
    return res.status(200).json({ message: "success", data: newCategory });
  } catch (error) {
    return res.status(400).json({ message: "error", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { maDanhMuc } = req.params;
    const categoryExist = await model.danhMucKhoaHoc.findOne({
      where: { maDanhMuc },
    });
    if (!categoryExist) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }
    // xóa khóa ngoại trước khi xóa danh mục
    await model.khoaHoc.destroy({ where: { loaiDanhMuc: maDanhMuc } });
    await model.danhMucKhoaHoc.destroy({ where: { maDanhMuc } });
    return res.status(200).json({ message: "Xóa danh mục thành công!" });
  } catch (error) {
    return res.status(400).json({ message: "error", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { maDanhMuc, tenDanhMuc } = req.body;
    const categoryExist = await model.danhMucKhoaHoc.findOne({
      where: { maDanhMuc },
    });
    if (!categoryExist) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }
    await model.danhMucKhoaHoc.update({ tenDanhMuc }, { where: { maDanhMuc } });
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(400).json({ message: "error", error: error.message });
  }
};

export { getAllCategory, addCategory, deleteCategory, updateCategory };
