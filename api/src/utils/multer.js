import multer from "multer";

// Định nghĩa nơi lưu trữ tệp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Image"); // Thư mục lưu trữ tệp
  },
  filename: (req, file, cb) => {
    let newName = new Date().getTime() + "_" + file.originalname; // 17442042443 , DD_MM_YYYY_hh_mm_ss_ms

    // Sử dụng tên gốc của tệp
    cb(null, newName); // Đặt tên tệp giống như tên gốc
  },
});

// Tạo middleware multer
const upload = multer({ storage: storage });

export default upload;
