import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class khoaHoc extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        maKhoaHoc: {
          type: DataTypes.STRING(255),
          allowNull: false,
          primaryKey: true,
        },
        tenKhoaHoc: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        giaTien: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        moTa: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        hinhAnh: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        nguoiTao: {
          type: DataTypes.STRING(100),
          allowNull: false,
          references: {
            model: "user",
            key: "taiKhoan",
          },
        },
        loaiDanhMuc: {
          type: DataTypes.STRING(255),
          allowNull: false,
          references: {
            model: "danhMucKhoaHoc",
            key: "maDanhMuc",
          },
        },
        ngayTao: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "khoaHoc",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "maKhoaHoc" }],
          },
          {
            name: "nguoiTao",
            using: "BTREE",
            fields: [{ name: "nguoiTao" }],
          },
          {
            name: "loaiDanhMuc",
            using: "BTREE",
            fields: [{ name: "loaiDanhMuc" }],
          },
        ],
      }
    );
  }
}
