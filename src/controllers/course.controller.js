import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import { Op } from "sequelize";
import fs from "fs";
import moment from "moment";

const model = initModels(sequelize);

//Lấy tất cả khóa học done
const getCourse = async (req, res) => {
  try {
    // Fetch all courses with creator's name from the database
    const listCourse = await model.course.findAll({
      include: [
        {
          model: model.user,
          attributes: ["username", "fullName", "roleId"],
          as: "creator",
          include: [
            {
              model: model.role,
              attributes: ["roleName"],
              as: "role",
            },
          ],
        },
        {
          model: model.courseCategory,

          as: "typeCourse",
        },
      ],
    });
    const formattedCourses = listCourse.map((course) => ({
      courseId: course.courseId,
      courseName: course.courseName,
      price: course.price,
      description: course.description,
      image: course.image,
      creationDate: moment(course.creationDate).format("DD-MM-YYYY"),
      updateDate: moment(course.updateDate).format("DD-MM-YYYY"),
      creator: {
        username: course.creator.username,
        fullName: course.creator.fullName,
        roleId: course.creator.roleId,
        roleName: course.creator.role.roleName,
      },
      category: course.typeCourse,
    }));
    console.log(listCourse);
    // Check if the list is empty
    if (listCourse.length === 0) {
      return res.status(404).json({ message: "No course found" });
    }

    res.status(200).json({ message: "success", data: formattedCourses });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(400).json({ message: "Error fetching course" });
  }
};

// Xóa khóa học
const deleteCourse = async (req, res) => {
  console.log(req, "req");
  try {
    let { courseId } = req.params;

    let course = await model.course.findByPk(courseId);
    console.log("course", course);

    if (!course) {
      return res.status(404).json({ message: "Khóa học không tồn tại" });
    }

    // Kiểm tra xem khóa học có học viên đăng ký không
    const enrolledCourses = await model.userCourse.findAll({
      where: { courseId },
    });

    if (enrolledCourses.length > 0) {
      return res
        .status(400)
        .json({ message: "Khóa học này đã có học viên, không thể xóa" });
    }

    // Xóa khóa học
    await model.course.destroy({ where: { courseId } });

    // Xóa ảnh nếu có sau khi xóa khóa học thành công
    if (course.image) {
      // const imagePath = path.join(__dirname, "public", "Image", course.image);
      deleteUploadedFile("public/image/" + course.image);
    }

    return res.status(200).json({ message: "Xóa khóa học thành công!" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error deleting course", error: error.message });
  }
};

// Hàm xóa file đã upload done
const deleteUploadedFile = (filePath) => {
  try {
    if (filePath) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error deleting course", error: error.message });
  }
};

//Thêm khóa học done
const addCourse = async (req, res) => {
  try {
    const { courseName, description, price, creatorAccount, courseType } =
      req.body;
    const image = req.file ? req.file.filename : null; // Đường dẫn đến hình ảnh
    console.log(req, "req");
    console.log(req.file, "req.file");

    // Kiểm tra xem người dùng có tồn tại không
    const userExist = await model.user.findOne({
      where: { username: creatorAccount },
    });

    if (!userExist) {
      deleteUploadedFile(req.file?.path); // Xóa file nếu người dùng không tồn tại
      return res
        .status(400)
        .json({ message: "Người dùng không tồn tại", data: null });
    }

    // Kiểm tra xem danh mục khóa học có tồn tại không
    const categoryExist = await model.courseCategory.findOne({
      where: { categoryName: courseType },
    });

    if (!categoryExist) {
      deleteUploadedFile(req.file?.path); // Xóa file nếu danh mục không tồn tại
      return res
        .status(400)
        .json({ message: "Danh mục khóa học không tồn tại", data: null });
    }

    // Tạo mã khóa học tự động dựa trên categoryId
    const categoryId = categoryExist.categoryId;
    const lastCourse = await model.course.findOne({
      where: { categoryId: categoryId },
      order: [["courseId", "DESC"]],
    });

    let newCourseId;
    if (lastCourse) {
      const lastCourseIdNumber =
        parseInt(lastCourse.courseId.slice(categoryId.length)) + 1;
      newCourseId = `${categoryId}${lastCourseIdNumber
        .toString()
        .padStart(5, "0")}`;
    } else {
      newCourseId = `${categoryId}00001`;
    }

    if (
      !newCourseId ||
      !courseName ||
      !description ||
      !price ||
      !courseType ||
      !creatorAccount ||
      !image
    ) {
      deleteUploadedFile(req.file?.path); // Xóa file nếu trường không hợp lệ
      return res.status(400).json({
        message: "Các trường  không được để trống",
        data: null,
      });
    }

    // Validate price
    if (isNaN(price) || price < 1000) {
      deleteUploadedFile(req.file?.path); // Xóa file nếu giá không hợp lệ
      return res.status(400).json({
        message: "Giá phải là một số dương và ít nhất là 1,000",
        data: null,
      });
    }

    // Tạo khóa học mới
    const newCourse = await model.course.create({
      courseId: newCourseId,
      courseName,
      description,
      image,
      price,
      userId: userExist.userId, // Sử dụng userId từ userExist
      categoryId: categoryExist.categoryId, // Sử dụng categoryId từ categoryExist
      creationDate: new Date(),
    });

    // Trả về thông tin khóa học với username và categoryName
    const courseData = {
      courseId: newCourse.courseId,
      courseName: newCourse.courseName,
      description: newCourse.description,
      image: newCourse.image,
      price: newCourse.price,
      creatorAccount: userExist.username, // Trả về username
      courseType: categoryExist.categoryName, // Trả về categoryName
      creationDate: newCourse.creationDate,
    };

    return res.status(200).json({ message: "success", data: courseData });
  } catch (err) {
    console.error(err); // Log lỗi
    return res
      .status(400)
      .json({ message: "Fail to create course", error: err.message });
  }
};

//Cập nhật khóa học
// const updateCourse = async (req, res) => {
//   try {
//     const { maKhoaHoc, tenKhoaHoc, moTa, giaTien, loaiDanhMuc } = req.body;
//     console.log(req.file.filename, "req.file");
//     const hinhAnh = req.file ? req.file.filename : null; // Đường dẫn đến hình ảnh mới

//     // Kiểm tra xem khóa học có tồn tại không
//     let course = await model.khoaHoc.findByPk(maKhoaHoc);
//     if (!course) {
//       return res.status(404).json({ message: "Khóa học không tồn tại" });
//     }

//     // Kiểm tra các trường cần thiết
//     if (!tenKhoaHoc || !moTa || !giaTien || !loaiDanhMuc) {
//       return res.status(400).json({
//         message:
//           "Các trường tenKhoaHoc, moTa, giaTien, loaiDanhMuc không được để trống",
//         data: null,
//       });
//     }

//     // Xóa ảnh cũ nếu có
//     if (course.hinhAnh) {
//       deleteUploadedFile("public/image/" + course.hinhAnh);
//     }

//     // Cập nhật khóa học
//     await model.khoaHoc.update(
//       {
//         tenKhoaHoc,
//         moTa,
//         hinhAnh: hinhAnh,
//         giaTien,
//         loaiDanhMuc,
//       },
//       { where: { maKhoaHoc } }
//     );

//     // Lấy lại thông tin khóa học đã cập nhật
//     course = await model.khoaHoc.findByPk(maKhoaHoc);
//     return res.status(200).json({ message: "success", data: course });
//   } catch (err) {
//     return res.status(400).json({ message: "error", error: err.message });
//   }
// };

// Cập nhật khóa học done
const updateCourse = async (req, res) => {
  try {
    const { courseId, courseName, description, price, courseType } = req.body;
    const image = req.file ? req.file.filename : null; // Đường dẫn đến hình ảnh mới

    // Kiểm tra xem khóa học có tồn tại không
    let course = await model.course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Khóa học không tồn tại" });
    }

    // Kiểm tra các trường cần thiết
    if (!courseName || !description || !price || !courseType) {
      return res.status(400).json({
        message:
          "Các trường courseName, description, price, courseType không được để trống",
        data: null,
      });
    }

    // Kiểm tra xem danh mục khóa học có tồn tại không
    const categoryExist = await model.courseCategory.findOne({
      where: { categoryName: courseType },
    });

    if (!categoryExist) {
      return res
        .status(400)
        .json({ message: "Danh mục khóa học không tồn tại", data: null });
    }

    // Xóa ảnh cũ nếu có
    if (course.hinhAnh) {
      deleteUploadedFile("public/image/" + course.hinhAnh);
    }

    // Cập nhật khóa học
    await model.course.update(
      {
        courseName,
        description,
        image: image || course.image, // Giữ lại ảnh cũ nếu không có ảnh mới
        price,
        categoryId: categoryExist.categoryId, // Sử dụng categoryId từ categoryExist
        updateDate: new Date(),
      },
      { where: { courseId } }
    );

    // Lấy lại thông tin khóa học đã cập nhật
    course = await model.course.findByPk(courseId);

    // Trả về thông tin khóa học với categoryName
    const courseData = {
      courseId: course.courseId,
      courseName: course.courseName,
      description: course.description,
      image: course.image,
      price: course.price,
      courseType: categoryExist.categoryName, // Trả về categoryName
      creationDate: course.creationDate,
      updateDate: course.updateDate,
    };

    return res.status(200).json({ message: "success", data: courseData });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

//Lấy danh sách khóa học theo danh mục done
const getCourseByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const listCourse = await model.course.findAll({
      where: { categoryId },
      include: [
        {
          model: model.courseCategory,
          as: "typeCourse",
          attributes: ["categoryName"],
        },
      ],
    });
    return res.status(200).json({ message: "success", data: listCourse });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

//Lấy thông tin khóa học theo maKhoaHoc done
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await model.course.findByPk(courseId, {
      include: [
        {
          model: model.user,
          attributes: ["username", "fullName", "roleId"],
          as: "creator",
          include: [
            {
              model: model.role,
              attributes: ["roleName"],
              as: "role",
            },
          ],
        },
        {
          model: model.courseCategory,
          as: "typeCourse",
        },
      ],
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Khóa học không tồn tại", data: null });
    }

    const formattedCourse = {
      courseId: course.courseId,
      courseName: course.courseName,
      price: course.price,
      description: course.description,
      image: course.image,
      creationDate: moment(course.creationDate).format("DD-MM-YYYY"),
      updateDate: moment(course.updateDate).format("DD-MM-YYYY"),
      creator: course.creator
        ? {
            username: course.creator.username,
            fullName: course.creator.fullName,
            roleId: course.creator.roleId,
            roleName: course.creator.role.roleName,
          }
        : null,
      category: course.typeCourse || null,
    };

    return res.status(200).json({ message: "success", data: formattedCourse });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

//Lấy danh sách khóa học theo tên khóa học
const getCourseByName = async (req, res) => {
  try {
    const { courseName } = req.params;
    const listCourse = await model.course.findAll({
      where: { courseName: { [Op.like]: `%${courseName}%` } },
    });
    return res.status(200).json({ message: "success", data: listCourse });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

//Lấy danh sách khóa học theo maNguoiDung (teaccher)
const getCourseByTeacher = async (req, res) => {
  try {
    const { userId } = req.params;
    const listCourse = await model.course.findAll({
      where: { userId },
      include: [
        {
          model: model.user,
          attributes: ["username", "fullName", "roleId"],
          as: "creator",
          include: [
            {
              model: model.role,
              attributes: ["roleName"],
              as: "role",
            },
          ],
        },
        {
          model: model.courseCategory,
          as: "typeCourse",
        },
      ],
    });
    const formattedCourses = listCourse.map((course) => ({
      courseId: course.courseId,
      courseName: course.courseName,
      price: course.price,
      description: course.description,
      image: course.image,
      creationDate: moment(course.creationDate).format("DD-MM-YYYY"),
      updateDate: moment(course.updateDate).format("DD-MM-YYYY"),
      creator: {
        username: course.creator.username,
        fullName: course.creator.fullName,
        roleId: course.creator.roleId,
        roleName: course.creator.role.roleName,
      },
      category: course.typeCourse,
    }));

    return res.status(200).json({ message: "success", data: formattedCourses });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

//Lấy danh sách khóa học bởi học viên
const getCourseByStudent = async (req, res) => {
  try {
    const { userId } = req.params;

    // Lấy danh sách khóa học của học viên cụ thể từ cơ sở dữ liệu
    const studentCourses = await model.userCourse.findAll({
      where: { userId },
      include: [
        {
          model: model.course,
          as: "coursesDetails", // Đảm bảo alias này khớp với alias được định nghĩa trong liên kết
        },
      ],
    });

    // Kiểm tra xem học viên có khóa học nào không
    if (studentCourses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this student" });
    }
    const studentCoursesFormatted = studentCourses.map((studentCourse) => ({
      userId: studentCourse.userId,
      courseId: studentCourse.courseId,
      // Giữ nguyên các thuộc tính ban đầu
      registrationDate: moment(studentCourse.registrationDate).format(
        "DD-MM-YYYY"
      ),
      coursesDetails: {
        courseId: studentCourse.coursesDetails.courseId,
        courseName: studentCourse.coursesDetails.courseName,
        price: studentCourse.coursesDetails.price,
        description: studentCourse.coursesDetails.description,
        image: studentCourse.coursesDetails.image,
        creationDate: moment(studentCourse.coursesDetails.creationDate).format(
          "DD-MM-YYYY"
        ),
        updateDate: moment(studentCourse.coursesDetails.updateDate).format(
          "DD-MM-YYYY"
        ),
        userId: studentCourse.coursesDetails.userId,
        category: studentCourse.coursesDetails.categoryId,
      },
    }));

    res.status(200).json({ message: "success", data: studentCoursesFormatted });
  } catch (err) {
    console.error(err); // Ghi lại lỗi để phục vụ mục đích gỡ lỗi
    res.status(400).json({ message: "Error fetching courses for student" });
  }
};

//Lấy danh sách khóa học thông qua từ khóa tìm kiếm
const getCourseByKeyword = async (req, res) => {
  try {
    const { keyword } = req.params;
    const listCourse = await model.course.findAll({
      where: {
        [Op.or]: [{ courseName: { [Op.like]: `%${keyword}%` } }],
      },
    });
    return res.status(200).json({ message: "success", data: listCourse });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

//Đăng kí khóa học cho học viên
const addCoursesToStudent = async (req, res) => {
  try {
    const { username, listCoursesId } = req.body; // listCoursesId là một mảng mã khóa học

    // Kiểm tra xem học viên có tồn tại không
    const student = await model.user.findOne({ where: { username } });
    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    // Tìm tất cả các khóa học trong danh sách
    const courses = await model.course.findAll({
      where: { courseId: listCoursesId },
    });

    if (courses.length !== listCoursesId.length) {
      return res.status(404).json({
        message: "Một số khóa học trong danh sách không tồn tại",
      });
    }

    // Lấy danh sách các khóa học đã đăng ký
    const existingEnrollments = await model.userCourse.findAll({
      where: { userId: student.userId, courseId: listCoursesId },
    });

    const existingCourseIds = existingEnrollments.map(
      (enrollment) => enrollment.courseId
    );

    // Lọc ra các khóa học chưa được đăng ký
    const newCoursesToEnroll = listCoursesId.filter(
      (courseId) => !existingCourseIds.includes(courseId)
    );

    if (newCoursesToEnroll.length === 0) {
      return res
        .status(400)
        .json({ message: "Người dùng đã đăng ký tất cả các khóa học này" });
    }

    // Tạo các bản ghi đăng ký mới
    const newEnrollments = await model.userCourse.bulkCreate(
      newCoursesToEnroll.map((courseId) => ({
        userId: student.userId,
        courseId,
        registrationDate: new Date(),
      }))
    );

    res.status(201).json({
      message: "Đã mua các khóa học thành công",
      data: newEnrollments,
    });
  } catch (err) {
    console.error(err); // Ghi lại lỗi để phục vụ mục đích gỡ lỗi
    res.status(400).json({ message: "Lỗi thêm khóa học", error: err.message });
  }
};

export {
  getCourse,
  addCourse,
  deleteCourse,
  updateCourse,
  getCourseByCategory,
  getCourseById,
  getCourseByName,
  getCourseByTeacher,
  getCourseByStudent,
  addCoursesToStudent,
  getCourseByKeyword,
};
