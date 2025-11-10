/*import pool from "../db/mysql.js";

export const searchUsers = async (req, res) => {
  const userId = req.user.id; // ✅ Authenticated user ID from verifyTokens
  const query = req.query.query || "";

  try {
    const [users] = await pool.query(
      "SELECT id, username, email FROM users WHERE (username LIKE ? OR email LIKE ?) AND id != ?",
      [`%${query}%`, `%${query}%`, userId]
    );

    return res.json(users);
  } catch (err) {
    console.error("🔴 Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};*/

import pool from "../db/mysql.js";

export const searchUsers = async (req, res) => {
  const userId = req.user.id; // ✅ Authenticated user ID from verifyTokens
  const query = req.query.q || ""; // ✅ matches frontend

  try {
    const [users] = await pool.query(
      "SELECT id, username, email FROM users WHERE (username LIKE ? OR email LIKE ?) AND id != ?",
      [`%${query}%`, `%${query}%`, userId]
    );

    return res.json(users);
  } catch (err) {
    console.error("🔴 Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

