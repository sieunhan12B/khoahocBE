import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _course from "./course.js";
import _courseCategory from "./courseCategory.js";
import _role from "./role.js";
import _user from "./user.js";
import _userCourse from "./userCourse.js";

export default function initModels(sequelize) {
  const course = _course.init(sequelize, DataTypes);
  const courseCategory = _courseCategory.init(sequelize, DataTypes);
  const role = _role.init(sequelize, DataTypes);
  const user = _user.init(sequelize, DataTypes);
  const userCourse = _userCourse.init(sequelize, DataTypes);

  course.belongsToMany(user, {
    as: "userId_users",
    through: userCourse,
    foreignKey: "courseId",
    otherKey: "userId",
  });
  user.belongsToMany(course, {
    as: "courseId_courses",
    through: userCourse,
    foreignKey: "userId",
    otherKey: "courseId",
  });
  userCourse.belongsTo(course, {
    as: "coursesDetails",
    foreignKey: "courseId",
  });
  course.hasMany(userCourse, { as: "userCourses", foreignKey: "courseId" });
  course.belongsTo(courseCategory, {
    as: "typeCourse",
    foreignKey: "categoryId",
  });
  courseCategory.hasMany(course, { as: "courses", foreignKey: "categoryId" });
  user.belongsTo(role, { as: "role", foreignKey: "roleId" });
  role.hasMany(user, { as: "users", foreignKey: "roleId" });
  course.belongsTo(user, { as: "creator", foreignKey: "userId" });
  user.hasMany(course, { as: "courses", foreignKey: "userId" });
  userCourse.belongsTo(user, { as: "user", foreignKey: "userId" });
  user.hasMany(userCourse, { as: "coursesPurchased", foreignKey: "userId" });

  return {
    course,
    courseCategory,
    role,
    user,
    userCourse,
  };
}
