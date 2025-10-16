import pool from "../db.js";


export const login = (req, res) => {
    const msg = req.query.msg;
    const logMsg = req.query.logMsg;

    res.render('login', {msg, logMsg})
}

export const prosesLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Proses login body:", req.body);

    // Validasi input
    if (!email || !password) {
      console.error("Email / password tidak boleh kosong");
      return res.redirect("/login?msg=Email dan password tidak boleh kosong");
    }

    const sql = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
    const values = [email];
    const result = await pool.query(sql, values);
    console.log("Query result:", result);

    if (result.rows.length === 0) {
      console.error("User tidak ditemukan");
      return res.redirect("/login?msg=Email atau password salah");
    }

    const user = result.rows[0];

    if (password !== user.password) {
      console.error("Password salah");
      return res.redirect("/login?msg=Email atau password salah");
    }

    req.session.user = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      imageUrl: user.imageurl || user.image_url || null,
    };

    console.log("Login berhasil untuk user:", user.email);
    return res.redirect("/?msg=Kamu berhasil login");
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).send("Terjadi kesalahan server");
  }
};


export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/?msg=kamu berhasil logout");
}