// controllers/projectController.js
import pool from "../db.js";

export const formProject = (req, res) => {
  res.render("formProject", { userLogin: req.session.user || null });
};
export const formEditProject = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `SELECT * FROM projects WHERE id = $1 LIMIT 1`;
    const values = [id];
    const result = await pool.query(sql, values);
    console.log("Query result:", result);
    if (result.rows.length === 0) {
      return res.status(404).send("Project tidak ditemukan");
    }
    const dataProjects = result.rows[0];
    console.log("Data Projects:", dataProjects);

    res.render("formEditProject", {
      dataProjects,
      userLogin: req.session.user || null,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

export const insertProject = async (req, res) => {
  try {
    const { title_project, desk, link_project } = req.body;
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);
    const techInput = req.body.checkbox;
    const techs = Array.isArray(techInput)
      ? techInput
      : techInput
      ? [techInput]
      : [];

    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .send("Gambar wajib diupload (field name: 'image').");
    }

    const sql = `
      INSERT INTO projects
        (title_project, desk, list_techs, link_project, "imageUrl")
      VALUES
        ($1, $2, $3::text[], $4, $5)
      RETURNING *;
    `;

    const filePath = `/files/${file.filename}`;

    const values = [title_project, desk, techs, link_project, filePath];

    const result = await pool.query(sql, values);
    console.log("data baru: ", result.rows[0]);
    return res.redirect("/?msg=Project berhasil ditambahkan#projects");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title_project, desk, link_project, existingImage } = req.body;

  let imageUrl = null;

  if (req.file && req.file.filename) {
    imageUrl = `/files/${req.file.filename}`; // ✅ URL publik yang konsisten
  } else if (existingImage && existingImage.trim() !== "") {
    imageUrl = existingImage; // pakai yang lama
  }
  


  const techInput = req.body.checkbox;
  const techs = Array.isArray(techInput)
    ? techInput
    : techInput
    ? [techInput]
    : [];

  const sql = `
  UPDATE projects
  SET
    title_project = $1,
    desk          = $2,
    list_techs    = $3::text[],
    link_project  = $4,
    "imageUrl"    = $5
  WHERE id = $6
  RETURNING *;
`;

  const values = [title_project, desk, techs, link_project, imageUrl, id];

  const result = await pool.query(sql, values);
  console.log("data upload: ", result);
  
  return res.redirect("/?msg=Project berhasil diupdate#projects");
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  const sql = `
    DELETE FROM projects
    WHERE id = $1
    RETURNING *;
  `;

    const values = [id];

    const result = await pool.query(sql, values);
    console.log("Project Berhasil dihapus: ", result);

    return res.redirect("/?msg=Project berhasil dihapus#projects");
}