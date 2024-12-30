import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import { Op } from "sequelize";

const model = initModels(sequelize);

// Lấy danh sách người dùng
const getUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const listUsers = await model.user.findAll();
    console.log(listUsers);
    // Check if the list is empty
    if (listUsers.length === 0) {
      return res.status(404).json({ message: "Không có người dùng nào cả" });
    }

    res
      .status(200)
      .json({ message: "Lấy dữ liệu thành công ", data: listUsers });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(400).json({ message: "Lỗi lấy dữ liệu người dùng" });
  }
};

//Thêm người dùng mới
const addUser = async (req, res) => {
  try {
    const { username, password, fullName, email, phone, roleId } = req.body;

    // Kiểm tra các giá trị rỗng hoặc không hợp lệ
    if (!username || !password || !fullName || !email || !phone) {
      console.error("Thiếu thông tin cần thiết.");
      return res.status(400).json({
        message:
          "Vui lòng điền đầy đủ thông tin: tài khoản, mật khẩu, họ tên, email và số điện thoại.",
        data: null,
      });
    }

    // Kiểm tra người dùng đã tồn tại bằng email, tài khoản hoặc số điện thoại
    const userExist = await model.user.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: username }, { phone: phone }],
      },
    });

    if (userExist) {
      if (userExist.email === email) {
        console.error("Email đã tồn tại.");
        return res.status(400).json({
          message: "Email đã tồn tại",
          data: null,
        });
      }

      if (userExist.username === username) {
        console.error("Tài khoản đã tồn tại.");
        return res.status(400).json({
          message: "Tài khoản đã tồn tại",
          data: null,
        });
      }

      if (userExist.phone === phone) {
        console.error("Số điện thoại đã tồn tại.");
        return res.status(400).json({
          message: "Số điện thoại đã tồn tại",
          data: null,
        });
      }
    }

    // Mặc định role là 'HV' nếu không được cung cấp
    const role = roleId || "HV";

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

    // Tạo người dùng mới
    const newUser = await model.user.create({
      userId: newUserId,
      username,
      password,
      fullName,
      email,
      phone,
      roleId: role,
    });
    console.log(newUser);

    return res.status(200).json({ message: "Thành công", data: newUser });
  } catch (err) {
    console.error(err); // Ghi lại lỗi đầy đủ để gỡ lỗi
    return res
      .status(400)
      .json({ message: "Không thể tạo người dùng", error: err.message });
  }
};

//Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    let { userId } = req.params;

    // Kiểm tra người dùng tồn tại
    let user = await model.user.findByPk(userId);
    console.log(user, "user");
    if (!user) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    // Kiểm tra xem người dùng có đăng ký khóa học nào không
    const enrolledCourses = await model.userCourse.findAll({
      where: { userId },
    });
    if (enrolledCourses.length > 0) {
      return res
        .status(400)
        .json({ message: "Người dùng này đã đăng ký khóa học, không thể xóa" });
    }

    // Kiểm tra xem người dùng có tạo khóa học nào không
    const createdCourses = await model.course.findAll({
      where: { userId },
    });
    if (createdCourses.length > 0) {
      return res
        .status(400)
        .json({ message: "Người dùng này đã tạo khóa học, không thể xóa" });
    }

    // Sau đó xóa người dùng
    const deletedCount = await model.user.destroy({
      where: { userId },
    });
    if (deletedCount === 0) {
      return res
        .status(400)
        .json({ message: "Không thể xóa người dùng, vui lòng thử lại" });
    }

    return res.status(200).json({ message: "Xóa người dùng thành công!" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return res.status(400).json({ message: "error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, fullName, password, email, phone, roleId } = req.body;

    // Kiểm tra các giá trị rỗng hoặc không hợp lệ
    if (!username || !password || !fullName || !email || !phone) {
      console.error("Thiếu thông tin cần thiết.");
      return res.status(400).json({
        message:
          "Vui lòng điền đầy đủ thông tin: tài khoản, mật khẩu, họ tên, email và số điện thoại.",
        data: null,
      });
    }

    // Kiểm tra định dạng email (nếu cần)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: "Email không hợp lệ.",
        data: null,
      });
    }

    // Tìm người dùng trong cơ sở dữ liệu theo tài khoản
    let user = await model.user.findOne({ where: { username } });
    if (!user) {
      console.error(`Tài khoản ${username} không tồn tại.`);
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }

    // Cập nhật thông tin người dùng
    await model.user.update(
      { fullName, password, email, phone, roleId },
      {
        where: { username },
      }
    );

    // Lấy lại thông tin người dùng sau khi cập nhật
    user = await model.user.findOne({ where: { username } });

    return res.status(200).json({
      message: "Cập nhật người dùng thành công!",
      data: user,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error.message);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi cập nhật người dùng.",
      error: error.message,
    });
  }
};


//*** */
// Lấy thông tin người dùnfg
const getUser = async (req, res) => {
  try {
    const { taiKhoan } = req.params;
    const user = await model.user.findByPk(taiKhoan);
    return res.status(200).json({ message: "success", data: user });
  } catch (error) {
    return res.status(400).json({ message: "error", error: error.message });
  }
};

export { getUsers, addUser, deleteUser, updateUser, getUser };
