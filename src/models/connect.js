import { Sequelize } from "sequelize";
import configDb from "../config/connect_db.js";

const sequelize = new Sequelize(
  // configDb.database, //tên database
  // configDb.user, // ten user
  // configDb.pass, //password user
  "khoa_hoc", //tên database
  "root", // ten user
  "123456", //password user
  {
    host: "localhost",
    port: 3308,
    dialect: "mysql",
  }
);

// Kiểm tra kết nối
// const testConnection = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Kết nối đến cơ sở dữ liệu thành công.");
//   } catch (error) {
//     console.error("Không thể kết nối đến cơ sở dữ liệu:", error);
//   }
// };

// testConnection();

export default sequelize;
