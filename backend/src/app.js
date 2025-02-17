import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import userRouter from "./routes/auth.route.js";
// import pumpRouter from "./routes/pump.route.js"

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(express.json({ limit: "1000kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static("public"));

const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/pump", pumpRouter);


export default app;
