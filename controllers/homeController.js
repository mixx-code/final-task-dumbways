import pool from "../db.js";

const dateID = (d) => {
  if (!d) return null;
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
};

export const home = (req, res) => {
  const logMsg = req.query.msg || null;
  const logMsgDelete = req.query.alertDelete || null;
  Promise.all([
    pool.query("SELECT * FROM users"),
    pool.query(`SELECT * FROM "work-experiences" ORDER BY start_date DESC`),
    pool.query(`SELECT * FROM projects ORDER BY id DESC`),
  ])
    .then(([userResult, experiencesResult, projectResult]) => {
      const user = userResult.rows?.[0] || null;

      const experiences = experiencesResult.rows || [];
      const viewExperiences = experiences.map((data) => ({
        ...data,
        start_date_fmt: dateID(data.start_date),
        end_date_fmt: data.end_date ? dateID(data.end_date) : "Present",
      }));
      const projects = projectResult.rows || [];

      console.log("User:", user);
      console.log("Experiences:", viewExperiences);
      console.log("projects:", projects);
      console.log("Session user:", req.session.user);

      res.render("index", {
        user,
        experiences: viewExperiences,
        projects,
        userLogin: req.session.user || null,
        logMsg,
        logMsgDelete,
      });
    })
    .catch((error) => {
      console.error("Database error:", error.message);
      res.status(500).send("Server error");
    });
};

