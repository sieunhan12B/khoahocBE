import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class course extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    courseId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    courseName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      references: {
        model: 'user',
        key: 'userId'
      }
    },
    categoryId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'courseCategory',
        key: 'categoryId'
      }
    },
    creationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    updateDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'course',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "fk_creator",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "fk_typeCourse",
        using: "BTREE",
        fields: [
          { name: "categoryId" },
        ]
      },
    ]
  });
  }
}
