import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import { Op } from "sequelize";

const model = initModels(sequelize);
//Lấy danh sách role
const getRoles = async (req, res) => {
  try {
    const roles = await model.role.findAll();
    return res.status(200).json({ message: "success", data: roles });
  } catch (error) {
    return res.status(400).json({ message: "error", error: error.message });
  }
};

export { getRoles };
