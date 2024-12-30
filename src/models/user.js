import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class user extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        userId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: "username",
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        fullName: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: "email",
        },
        phone: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: "phone",
        },
        roleId: {
          type: DataTypes.STRING(50),
          allowNull: true,
          references: {
            model: "role",
            key: "roleId",
          },
        },
      },
      {
        sequelize,
        tableName: "user",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "username",
            unique: true,
            using: "BTREE",
            fields: [{ name: "username" }],
          },
          {
            name: "email",
            unique: true,
            using: "BTREE",
            fields: [{ name: "email" }],
          },
          {
            name: "phone",
            unique: true,
            using: "BTREE",
            fields: [{ name: "phone" }],
          },
          {
            name: "roleId",
            using: "BTREE",
            fields: [{ name: "roleId" }],
          },
        ],
      }
    );
  }
}
