const { query } = require('../db/db');

const Session = {
  async createSession({ session_id, email, token, created_at, updated_at }) {
    try {
      
      const sql = `
        INSERT INTO iris_sb_test.sessions
        (email, session_token, created_at, updated_at, last_activity) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const params = [email, token, created_at, updated_at, new Date()];
      const result = await query(sql, params);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in createSession:', error.message);
      throw error;
    }
  },

  async findSessionByEmpId(email) {
    try {
      const sql = `SELECT * FROM iris_sb_test.sessions WHERE email = $1`;
      const params = [email];
      const result = await query(sql, params);
      return result.rows[0];
    } catch (error) {
      console.error('Error in findSessionByEmpId:', error.message);
      throw error;
    }
  },

  async deleteSessionByEmpId(email) {
    try {

      console.log("I am in delete session")
      const sql = `DELETE FROM iris_sb_test.sessions WHERE email = $1`;
      const params = [email];
      const resses = await query(sql, params);
      console.log(resses)
      return true;
    } catch (error) {
      console.error('Error in deleteSessionByEmpId:', error.message);
      throw error;
    }
  },

  async updateLastActivity(email) {
    try {
      const sql = `UPDATE iris_sb_test.sessions SET last_activity = $1 WHERE email = $2`;
      const params = [new Date(), email];
      await query(sql, params);
    } catch (error) {
      console.error('Error in updateLastActivity:', error.message);
      throw error;
    }
  },

  async deleteExpiredSessions() {
    try {
      const sql = `DELETE FROM iris_sb_test.sessions WHERE last_activity < $1`;
      const expiryTime = new Date(Date.now() - 60 * 60 * 1000); // 1 hour inactivity
      const params = [expiryTime];
      await query(sql, params);
      return true;
    } catch (error) {
      console.error('Error in deleteExpiredSessions:', error.message);
      throw error;
    }
  },
};

module.exports = Session;




