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
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ message: "success", data: listUsers });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(400).json({ message: "Error fetching users" });
  }
};

//Thêm người dùng mới

const addUser = async (req, res) => {
  try {
    const { taiKhoan, matKhau, hoTen, email, sdt, role } = req.body;
    console.log({
      taiKhoan,
      email,
      matKhau,
      hoTen,
      sdt,
      role,
    });

    // Check for existing user by email, account name, or phone number
    const userExist = await model.user.findOne({
      where: {
        [Op.or]: [{ email: email }, { taiKhoan: taiKhoan }, { sdt: sdt }],
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

      if (userExist.taiKhoan === taiKhoan) {
        console.error("Tài khoản đã tồn tại.");
        return res.status(400).json({
          message: "Tài khoản đã tồn tại",
          data: null,
        });
      }

      if (userExist.sdt === sdt) {
        console.error("Số điện thoại đã tồn tại.");
        return res.status(400).json({
          message: "Số điện thoại đã tồn tại",
          data: null,
        });
      }
    }

    const newUser = await model.user.create({
      taiKhoan,
      matKhau,
      hoTen,
      email,
      sdt,
      role: role || "HV", // Default role to 'user' if not provided
    });
    console.log(newUser);

    return res.status(200).json({ message: "success", data: newUser });
  } catch (err) {
    console.error(err); // Log the full error for debugging
    return res
      .status(400)
      .json({ message: "Fail to create user", error: err.message });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    let { taiKhoan } = req.params;
    console.log(taiKhoan, "taiKhoan9");
    // Chuẩn hóa taiKhoan

    // Kiểm tra người dùng tồn tại
    let user = await model.user.findByPk(taiKhoan);
    console.log(user, "user");
    if (!user) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    // Xóa các khóa ngoại trước
    await model.khoaHoc.destroy({ where: { nguoiTao: taiKhoan } });

    // Sau đó xóa người dùng
    const deletedCount = await model.user.destroy({
      where: { taiKhoan: taiKhoan },
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

// Cập nhật người dùng
const updateUser = async (req, res) => {
  try {
    const { taiKhoan, hoTen, matKhau, email, sdt, role } = req.body;

    // cách 1:
    // check user có tồn tại trong database hay không
    let user = await model.user.findByPk(taiKhoan);
    // let user = await model.users.findOne({
    //     where: {user_id}
    // })
    if (!user) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }

    await model.user.update(
      { hoTen, matKhau, email, sdt, role },
      {
        where: { taiKhoan },
      }
    );
    // Lấy lại thông tin người dùng sau khi cập nhật
    user = await model.user.findByPk(taiKhoan);

    // cách 2: dùng chính object user để update infor user
    // user.full_name = full_name || user.full_name;
    // user.pass_word = pass_word || user.pass_word;
    // await user.save()

    return res
      .status(200)
      .json({ message: "Cập nhật người dùng thành công!", data: user });
  } catch (error) {
    return res.status(400).json({ messgae: "error", error: error.message });
  }
};

// Lấy thông tin người dùng
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
