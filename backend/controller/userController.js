const { query } = require('../db/db');
const CryptoJS = require('crypto-js');

// console.log(process.env.SECRET_KEY);  

const User = {
  async register({ emp_id, name, email, password, role, department}) {
    try {
      const timestamp = new Date(); // Generate current timestamp
      const flag = true; // Default value for the flag
  
      // Encrypt the password before storing
      const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
  
      const sql = `
        INSERT INTO iris_sb_test.distributor_credentials
        (emp_id, name, email, password, role, department, created_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      
      const params = [
        emp_id,
        name,
        email,
        encryptedPassword,  // Store encrypted password
        role,
        department,
        timestamp,
      ];
  
      const result = await query(sql, params); // Use `sql` instead of `query` for the query string
      return result.rows[0];
    } catch (error) {
      console.error('Error in register:', error.message);
      throw error;
    }
  },

  async findByEmail(email) {
    try {
      const sql = `SELECT * FROM iris_sb_test.distributor_credentials WHERE email = $1`;
      const params = [email];
      // console.log(params)
      const result = await query(sql, params);
      // console.log(result.rows[0])
      return result.rows[0];
    } catch (error) {
      console.error('Error in findByEmail:', error.message);
      throw error;
    }
  },

  async updateFlag(emp_id, flag) {
    try {
      const sql = `
        UPDATE iris_sb_test.distributor_credentials
        SET flag = $1, updated_at = $2 
        WHERE emp_id = $3 RETURNING *`;
      const params = [flag, new Date(), emp_id];
      const result = await query(sql, params); // No shadowing issue here
      return result.rows[0];
    } catch (error) {
      console.error('Error in updateFlag:', error.message);
      throw error;
    }
  },
  async getAccessListAndDepartmentByRole(role) {
    try {
      const sql = `SELECT access_list, department FROM iris.access_list WHERE role = $1`;
      const params = [role];
      const result = await query(sql, params);

      if (result.rows.length === 0) {
        throw new Error('Role not found');
      }

      // Parse access_list as JSON
      const accessList = (result.rows[0].access_list);
      const department = result.rows[0].department;

      return { accessList, department };
    } catch (error) {
      console.error('Error fetching access list and department by role:', error.message);
      throw error;
    }
  },

  async getUserByEmpId(emp_id) {
    try {
      const sql = `SELECT * FROM iris.onboarded_users WHERE emp_id = $1`;
      const params = [emp_id];
      const result = await query(sql, params);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching user by emp_id:', error.message);
      throw error;
    }
  },

  async fetchUserByEmpId(emp_id) {
    try {
      const sql = `SELECT * FROM iris.users WHERE emp_id = $1`;
      const params = [emp_id];
      const result = await query(sql, params);
      return result.rows[0]; // Return the first row if found
    } catch (error) {
      console.error('Error in fetchUserByEmpId:', error.message);
      throw error;
    }
  },
  async updateUserDataByEmpId(emp_id, updateData) {
    try {
      // Dynamically handle fields to update
      const fields = Object.keys(updateData).map((key, index) => {
        if (key === 'access_list') {
          // Ensure access_list is already in valid JSON format from the request handler
          updateData[key] = updateData[key]; // No need for extra JSON.stringify here
        }
        return `${key} = $${index + 2}`;
      }).join(', ');
  
      // SQL query to update user data
      const sql = `
        UPDATE iris.users
        SET ${fields}, updated_at = $${Object.keys(updateData).length + 2}
        WHERE emp_id = $1
        RETURNING *;
      `;
  
      const params = [
        emp_id,
        ...Object.values(updateData),
        new Date(), // Set the updated_at field to the current timestamp
      ];
  
      const result = await query(sql, params);
      return result.rows[0]; // Return the updated user
    } catch (error) {
      console.error('Error in updateUserDataByEmpId:', error.message);
      throw error;
    }
  },
  // Delete user by emp_id
  async deleteUserByEmpId(emp_id) {
    try {
      const sql = `DELETE FROM iris.users WHERE emp_id = $1 RETURNING *;`;
      const result = await query(sql, [emp_id]);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting user by emp_id:', error.message);
      throw error;
    }
  },
};        

module.exports = User;
