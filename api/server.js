// Chạy backend
// import thư viện
import express from "express";
import rootRoutes from "./src/routes/root.router.js";
import cors from "cors";
import path from "path";

// tạo đối tượng
const app = express();
app.use(express.json());

app.use(cors());
app.use(express.json());

app.use(express.static("public"));
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "https://ban-khoa-hoc-truc-tuyen.vercel.app",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("CHao dang gia bao ");
});

app.use(rootRoutes);

// define port để BE chạy
app.listen(8080, () => {
  console.log("Sever online with port 8080");
});
