import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _danhMucKhoaHoc from  "./danhMucKhoaHoc.js";
import _khoaHoc from  "./khoaHoc.js";
import _user from  "./user.js";

export default function initModels(sequelize) {
  const danhMucKhoaHoc = _danhMucKhoaHoc.init(sequelize, DataTypes);
  const khoaHoc = _khoaHoc.init(sequelize, DataTypes);
  const user = _user.init(sequelize, DataTypes);

  khoaHoc.belongsTo(danhMucKhoaHoc, { as: "danhMuc", foreignKey: "loaiDanhMuc"});
  danhMucKhoaHoc.hasMany(khoaHoc, { as: "khoaHocs", foreignKey: "loaiDanhMuc"});
  khoaHoc.belongsTo(user, { as: "nguoiTao_user", foreignKey: "nguoiTao"});
  user.hasMany(khoaHoc, { as: "khoaHocs", foreignKey: "nguoiTao"});

  return {
    danhMucKhoaHoc,
    khoaHoc,
    user,
  };
}
