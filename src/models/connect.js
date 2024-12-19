import { Sequelize } from "sequelize";
import configDb from "../config/connect_db.js";

const sequelize = new Sequelize(
  configDb.database, //tên database
  configDb.user, // ten user
  configDb.pass, //password user
  {
    host: configDb.host,
    port: configDb.port,
    dialect: configDb.dialect,
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
