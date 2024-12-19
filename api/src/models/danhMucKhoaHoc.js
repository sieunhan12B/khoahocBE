import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class danhMucKhoaHoc extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maDanhMuc: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    tenDanhMuc: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'danhMucKhoaHoc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maDanhMuc" },
        ]
      },
    ]
  });
  }
}
