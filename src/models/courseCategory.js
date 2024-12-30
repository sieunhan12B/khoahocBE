import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class courseCategory extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    categoryId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    categoryName: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'courseCategory',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "categoryId" },
        ]
      },
    ]
  });
  }
}
