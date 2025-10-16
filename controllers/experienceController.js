import pool from "../db.js";

const dateID = (d) => {
  if (!d) return "";

  const dt = d instanceof Date ? d : new Date(d);

  const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10); // 'YYYY-MM-DD'
};


export const formExperience = (req, res) => {
  res.render("formExperience");
};

export const formEditExperience = async (req, res) => {
  const { id } = req.params;
  console.log("ID Param:", id);

  try {
    const sql = `SELECT * FROM "work-experiences" WHERE id = $1 LIMIT 1`;
    const { rows } = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).send("Experience tidak ditemukan");
    }

    const row = rows[0];

    const dataExperience = {
      ...row,
      start_date: dateID(row.start_date),
      end_date: dateID(row.end_date),
    };

    return res.render("formEditExperience", {
      dataExperience,
      userLogin: req.session.user || null,
    });
  } catch (error) {
    console.error("formEditExperience error:", error.message);
    return res.status(500).send("Server error");
  }
};

export const insertExperience = async (req, res) => {
  try {
    const { posisi, perusahaan, start_date, end_date } = req.body;

    console.log("body > ", req.body);
    console.log("file > ", req.file);

    const techInput = req.body.checkbox;
    const list_techs = Array.isArray(techInput)
      ? techInput.map((t) => String(t).trim()).filter(Boolean)
      : techInput
      ? [String(techInput).trim()]
      : [];

    const tasksInput = req.body["list_tasks"];
    const list_tasks = Array.isArray(tasksInput)
      ? tasksInput.map((t) => String(t).trim()).filter(Boolean)
      : tasksInput
      ? [String(tasksInput).trim()]
      : [];

    if (!posisi || !perusahaan || !start_date || !end_date) {
      return res.status(400).json({ error: "Field wajib tidak lengkap." });
    }
    if (new Date(start_date) > new Date(end_date)) {
      return res
        .status(400)
        .json({ error: "Start date tidak boleh setelah end date." });
    }

    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .send("Gambar wajib diupload (field name: 'image').");
    }

    const sql = `
      INSERT INTO "work-experiences"
        ("imageUrl", posisi, perusahaan, start_date, list_tasks, list_techs, end_date)
      VALUES
        ($1, $2, $3, $4, $5::text[], $6::text[], $7)
      RETURNING *;
    `;

    const values = [
      `/uploads/${file.filename}`,
      posisi,
      perusahaan,
      start_date,
      list_tasks,
      list_techs,
      end_date,
    ];

    const result = await pool.query(sql, values);
    console.log("data baru: ", result.rows[0]);

    return res.redirect("/?msg=experience berhasil ditambah#experiences");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const updateExperience = async (req, res) => {
  const { id } = req.params;
  try {
    const { posisi, perusahaan, start_date, end_date, existingImage } =
      req.body;

    console.log("body > ", req.body);
    console.log("file > ", req.file);

    const techInput = req.body.checkbox;
    const list_techs = Array.isArray(techInput)
      ? techInput.map((t) => String(t).trim()).filter(Boolean)
      : techInput
      ? [String(techInput).trim()]
      : [];

    const tasksInput = req.body["list_tasks"];
    const list_tasks = Array.isArray(tasksInput)
      ? tasksInput.map((t) => String(t).trim()).filter(Boolean)
      : tasksInput
      ? [String(tasksInput).trim()]
      : [];

    if (!posisi || !perusahaan || !start_date || !end_date) {
      return res.status(400).json({ error: "Field wajib tidak lengkap." });
    }
    if (new Date(start_date) > new Date(end_date)) {
      return res
        .status(400)
        .json({ error: "Start date tidak boleh setelah end date." });
    }

    let imageUrl = null;
    if (req.file && req.file.filename) {
      imageUrl = `/uploads/${req.file.filename}`; // file baru
    } else if (existingImage && existingImage.trim() !== "") {
      imageUrl = existingImage; // pakai yang lama
    }
  
    const sql = `
      UPDATE "work-experiences"
      SET
        "imageUrl"   = $1,
        posisi      = $2,
        perusahaan  = $3,
        start_date  = $4,
        list_tasks  = $5::text[],
        list_techs  = $6::text[],
        end_date    = $7
      WHERE id = $8
      RETURNING *;
    `;
    const values = [
      imageUrl,
      posisi,
      perusahaan,
      start_date,
      list_tasks,
      list_techs,
      end_date,
      id,
    ];

    const result = await pool.query(sql, values);
    console.log("data update: ", result.rows);
    

    return res.redirect("/?msg=experience berhasil diupdate#experiences");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const deleteExperience = async (req, res) => {
  const { id } = req.params;
  const sql = `
    DELETE FROM "work-experiences"
    WHERE id = $1
    RETURNING *;
  `;

  const values = [id];

  const result = await pool.query(sql, values);
  console.log("experience Berhasil dihapus: ", result);

  return res.redirect("/?msg=experience berhasil dihapus#experiences");
};