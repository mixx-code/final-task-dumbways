import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import HomeRoute from "./routes/home.js"
import ProjectRoute from "./routes/project.js"
import AuthRoute from "./routes/auth.js"
import ExperienceRoute from "./routes/experience.js"

import hbs from "hbs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = 3000;

app.set("trust proxy", 1);
app.use(
  session({
    secret: "kucing",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.set("view engine", "hbs");
hbs.registerHelper(
  "includes",
  (arr, val) => Array.isArray(arr) && arr.includes(val)
);

app.set("views", path.join(__dirname, "src/views"));

app.use(express.urlencoded({ extended: false }));

// app.use("/assets", express.static("src/assets"));

if (process.env.NODE_ENV !== "production") {
  app.use("/files", express.static(path.join(__dirname, "uploads")));
}

if (process.env.NODE_ENV === "production") {
  app.get("/files/:name", (req, res) => {
    const filePath = path.join("/tmp", req.params.name);
    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) return res.sendStatus(404);
      res.sendFile(filePath);
    });
  });
}
app.use(express.static("public"));

app.use(HomeRoute);
app.use(ProjectRoute);
app.use(AuthRoute);
app.use(ExperienceRoute);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

