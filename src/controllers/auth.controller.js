import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import moment from "moment";
// import bcrypt from "bcrypt";
import { Op } from "sequelize";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import transporter from "../config/transporter.js";
// import { createRefToken, createToken } from "../config/jwt.js";

const model = initModels(sequelize);
// đăng kí tài khoản
const register = async (req, res, next) => {
  try {
    /**
     * Bước 1: nhận dữ liệu từ FE
     */
    const { username, password, fullName, email, phone } = req.body;
    console.log(username, password, fullName, email, phone);
    /**
     * Bước 2: kiểm tra email xem đã tồn tại trong db hay chưa
     *    - nếu tồn tại: trả lỗi "Tài khoản đã tồn tại"
     *    - nếu chưa tồn tại: đi tiêp
     */
    const userExist = await model.user.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: username }, { phone: phone }],
      },
    });

    if (userExist) {
      if (userExist.email === email) {
        return res.status(400).json({
          message: "Email đã tồn tại",
          data: null,
        });
      }

      if (userExist.username === username) {
        return res.status(400).json({
          message: "Tài khoản đã tồn tại",
          data: null,
        });
      }

      if (userExist.phone === phone) {
        return res.status(400).json({
          message: "Số điện thoại đã tồn tại",
          data: null,
        });
      }
    }
    /**
     * mã hoá pass
     */
    /**
     * Bước 3: thêm người dùng mới vào db
     */
    // const userNew = await model.user.create({
    //   fullName: fullName,
    //   email: email,
    //   password: bcrypt.hashSync(password, 10),
    // });

    // tạo id mới
    const role = "HV";
    const lastUser = await model.user.findOne({
      where: { roleId: role },
      order: [["userId", "DESC"]],
    });
    let newUserId;
    if (lastUser) {
      const lastUserIdNumber = parseInt(lastUser.userId.slice(role.length)) + 1;
      newUserId = `${role}${lastUserIdNumber.toString().padStart(5, "0")}`;
    } else {
      newUserId = `${role}00001`;
    }

    const newUser = await model.user.create({
      userId: newUserId,
      username,
      password,
      fullName,
      email,
      phone,
      roleId: "HV", // Default roleId to 'user' if not provided
    });
    return res.status(200).json({ message: "success", data: newUser });

    //   cấu hình info email
    // const mailOption = {
    //   from: process.env.MAIL_USER,
    //   to: email,
    //   subject: "Welcome to Our service",
    //   text: `Hello ${fullName}. ${password} Best Regards.`,
    //   html: `<h1>ahihihi đồ ngốc</h1>`,
    // };

    // //   gửi email
    // transporter.sendMail(mailOption, (err, info) => {
    //   if (err) {
    //     return res.status(500).json({ message: "Sending email error" });
    //   }
    //   return res.status(200).json({
    //     message: "Đăng ký thành công",
    //     data: userNew,
    //   });
    // });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Fail to create user", error: error.message });
  }
};

// đăng nhập
const login = async (req, res) => {
  try {
    let { username, password } = req.body;
    let user = await model.user.findOne({
      where: {
        [Op.and]: [{ username: username }, { password: password }],
      },
    });

    // Check if user exists
    if (!user) {
      return res
        .status(400)
        .json({ message: "Tài khoản hoặc mật khẩu không đúng" });
    }

    // Check if password matches (assuming you have bcrypt imported and used)
    // let checkPass = (password, user.password);
    // if (!checkPass) {
    //   return res.status(400).json({ message: "Mật khẩu không đúng" });
    // }

    return res.status(200).json({ message: "success", data: user });
  } catch (error) {
    return res.status(400).json({ message: "error", error: error.message });
  }
};

//Lấy thông tin người dùng
const getInfoUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(username);

    // Tìm thông tin người dùng
    const user = await model.user.findOne({
      where: { userId },
      include: [
        {
          model: model.userCourse,
          as: "coursesPurchased",
          include: [
            {
              model: model.course,
              as: "coursesDetails",
              attributes: ["courseId", "courseName", "image", "description"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Lấy chi tiết các khóa học và định dạng lại dữ liệu
    const courses = user.coursesPurchased.map((enrollment) => ({
      courseId: enrollment.coursesDetails.courseId,
      courseName: enrollment.coursesDetails.courseName,
      image: enrollment.coursesDetails.image,
      description: enrollment.coursesDetails.description,
      registrationDate: moment(enrollment.registrationDate).format(
        "DD-MM-YYYY"
      ),
    }));

    return res.status(200).json({
      message: "success",
      data: {
        userId: user.userId,
        username: user.username,
        password: user.password,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roleId: user.roleId,
        coursesPurchased: courses,
      },
    });
  } catch (error) {
    console.error(error); // Ghi lại lỗi để phục vụ mục đích gỡ lỗi
    return res.status(400).json({ message: "error", error: error.message });
  }
};

const updateInfoUser = async (req, res) => {
  try {
    const { username, fullName, email, phone, password } = req.body;
    let user = await model.user.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await model.user.update(
      { fullName, email, phone, password },
      { where: { username } }
    );
    user = await model.user.findByPk(username);

    return res.status(200).json({ message: "success", data: user });
  } catch (error) {
    return res.status(400).json({ message: "error", error: error.message });
  }
};

// const loginFacebook = async (req, res) => {
//   try {
//     // B1: lấy id, email và name từ request
//     // B2: check id (app_face_id trong db)
//     // B2.1: nếu có app_face_id => tạo access token => gửi về FE
//     // B2.2: nếu kko có app_face_id => tạo user mới => tạo access token => gửi về FE
//     let { id, email, name } = req.body;
//     let user = await model.users.findOne({
//       where: { face_app_id: id },
//     });
//     if (!user) {
//       let newUser = {
//         full_name: name,
//         face_app_id: id,
//         email,
//       };
//       user = await model.users.create(newUser);
//     }
//     let accessToken = createToken({ userId: user.user_id });
//     return res.status(200).json({
//       message: "Login successfully",
//       data: accessToken,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "error" });
//   }
// };

// const extendToken = async (req, res) => {
//   try {
//     // lấy refresh token từ cookie của request
//     let refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) {
//       return res.status(401);
//     }

//     // check refresh token trong database
//     let userRefToken = await model.users.findOne({
//       where: {
//         refresh_token: refreshToken,
//       },
//     });
//     if (!userRefToken) {
//       return res.status(401);
//     }
//     let newAccessToken = createToken({ userId: userRefToken.user_id });
//     return res.status(200).json({ message: "Success", data: newAccessToken });
//   } catch (error) {
//     return res.status(500).json({ message: "error" });
//   }
// };

export { register, login, getInfoUser, updateInfoUser };
