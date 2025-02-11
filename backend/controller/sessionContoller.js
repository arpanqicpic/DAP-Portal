const { query } = require('../db/db');

const Session = {
  async createSession({ session_id, emp_id, token, created_at, updated_at }) {
    try {
      
      const sql = `
        INSERT INTO iris_sb_test.sessions
        (user_id, session_token, created_at, updated_at, last_activity) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const params = [emp_id, token, created_at, updated_at, new Date()];
      const result = await query(sql, params);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in createSession:', error.message);
      throw error;
    }
  },

  async findSessionByEmpId(emp_id) {
    try {
      const sql = `SELECT * FROM iris_sb_test.sessions WHERE user_id = $1`;
      const params = [emp_id];
      const result = await query(sql, params);
      return result.rows[0];
    } catch (error) {
      console.error('Error in findSessionByEmpId:', error.message);
      throw error;
    }
  },

  async deleteSessionByEmpId(emp_id) {
    try {

      console.log("I am in delete session")
      const sql = `DELETE FROM iris_sb_test.sessions WHERE user_id = $1`;
      const params = [emp_id];
      const resses = await query(sql, params);
      console.log(resses)
      return true;
    } catch (error) {
      console.error('Error in deleteSessionByEmpId:', error.message);
      throw error;
    }
  },

  async updateLastActivity(emp_id) {
    try {
      const sql = `UPDATE iris_sb_test.sessions SET last_activity = $1 WHERE user_id = $2`;
      const params = [new Date(), emp_id];
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




