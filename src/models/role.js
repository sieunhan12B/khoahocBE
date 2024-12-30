import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class role extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    roleId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    roleName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "roleName"
    }
  }, {
    sequelize,
    tableName: 'role',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "roleId" },
        ]
      },
      {
        name: "roleName",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "roleName" },
        ]
      },
    ]
  });
  }
}
