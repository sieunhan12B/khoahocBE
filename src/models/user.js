import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class user extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    taiKhoan: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    matKhau: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    hoTen: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "email"
    },
    sdt: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "sdt"
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "HV"
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "taiKhoan" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "sdt",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sdt" },
        ]
      },
    ]
  });
  }
}
