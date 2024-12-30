import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class userCourse extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    userId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'userId'
      }
    },
    courseId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'course',
        key: 'courseId'
      }
    },
    registrationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'userCourse',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userId" },
          { name: "courseId" },
        ]
      },
      {
        name: "fk_course",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
    ]
  });
  }
}
