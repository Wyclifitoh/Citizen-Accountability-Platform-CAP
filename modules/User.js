const pool = require('../config/db');

// Create a new user
exports.createUser = async (userData) => {
  const { uid, first_name, last_name, phone_number, email, profile_photo, password, user_type } = userData;
  const sql = `INSERT INTO users (uid, first_name, last_name, phone_number, email, profile_photo, password, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await pool.query(sql, [uid, first_name, last_name, phone_number, email, profile_photo, password, user_type]);
  return result;
};

// Find user by email
exports.findUserByEmail = async (email) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  const [rows] = await pool.query(sql, [email]);
  return rows[0];
};

// Find user by id
exports.findUserById = async (id) => {
  const sql = `SELECT * FROM users WHERE id = ?`;
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
};

// Find user by reset token
exports.findUserByResetToken = async (token) => {
  const sql = `SELECT * FROM users WHERE reset_token = ? AND reset_token_expire > ?`;
  const [rows] = await pool.query(sql, [token, Date.now()]);
  return rows[0];
};

// Update reset token and expiration
exports.updateResetToken = async (email, token, expire) => {
  const sql = `UPDATE users SET reset_token = ?, reset_token_expire = ? WHERE email = ?`;
  await pool.query(sql, [token, expire, email]);
};

// Update password
exports.updatePassword = async (email, password) => {
  const sql = `UPDATE users SET password = ?, reset_token = NULL, reset_token_expire = NULL WHERE email = ?`;
  await pool.query(sql, [password, email]);
};

exports.saveRefreshToken = async (user_id, refresh_token) => {
  try {
    // Check if the token already exists for the user
    const checkSql = 'SELECT * FROM refresh_token WHERE user_id = ?';
    const [rows] = await pool.query(checkSql, [user_id]);

    if (rows.length > 0) {
      // Token exists, so update it
      const updateSql = 'UPDATE refresh_token SET refresh_token = ? WHERE user_id = ?';
      const [result] = await pool.query(updateSql, [refresh_token, user_id]);
      return { result, action: 'updated' };
    } else {
      // Token does not exist, so insert a new record
      const insertSql = 'INSERT INTO refresh_token (user_id, refresh_token) VALUES (?, ?)';
      const [result] = await pool.query(insertSql, [user_id, refresh_token]);
      return { result, action: 'inserted' };
    }
  } catch (error) {
    console.error('Error saving refresh token:', error);
    throw error;
  }
}

exports.deleteToken = async (user_id, refresh_token) => {
    const sql = 'DELETE FROM refresh_token WHERE user_id = ? AND refresh_token = ?'
    const result = await pool.query(sql, [user_id, refresh_token] );
    return result; 
};

// Find user by id
exports.findRefreshTokenById = async (id) => {
  const sql = `SELECT * FROM refresh_token WHERE user_id = ?`;
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
};

exports.updateUserPassword = async (user_id, hashedNewPassword) => { 

  const sql = `
      UPDATE users
      SET 
          password = ? 
      WHERE id = ?
  `;

  try {
      const [result] = await pool.query(sql, [hashedNewPassword, user_id]);

      return [result];
  } catch (error) {
      console.error('Error updating user password:', error);
      throw error; // Optionally, rethrow the error to be handled by the calling function
  }
};

exports.updateUser = async (user_id, updateData) => {
  const { first_name, last_name, phone_number } = updateData;

  const sql = `
      UPDATE users
      SET 
          first_name = ?,
          last_name = ?, 
          phone_number = ? 
      WHERE id = ?
  `;

  try {
      const [result] = await pool.query(sql, [first_name, last_name, phone_number, user_id]);

      return [result];
  } catch (error) {
      console.error('Error updating user info:', error);
      throw error; // Optionally, rethrow the error to be handled by the calling function
  }
};


