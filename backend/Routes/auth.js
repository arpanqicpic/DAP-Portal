// const express = require('express');
// const bcrypt = require('bcrypt');
// const pool = require('../db/db');
// const Middleware=require('../middleware/authMiddleWare')
// const router = express.Router();
// const cookieParser=require('cookie-parser');

// // Route for registering a new user

// router.use(cookieParser());

// router.post('/register', async (req, res) => {
//     const { distributor_id, password } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const result = await pool.query(
//             'insert into iris_sb_test.distributor_login_credentials (distributor_id ,password ) VALUES ($1, $2) RETURNING distributor_id',
//             [distributor_id, hashedPassword]
//         );

//         console.log(hashedPassword)
//         res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id, hashedPassword });
//     } catch (err) {
//         res.status(500).json({ message: 'Error registering user', error: err.message });
//     }
// });


// router.post('/login', async (req, res) => {
//     const { email_id, password } = req.body;
//     console.log(req.body)

//     try {
//         const result = await pool.query('select * from iris_sb_test.distributor_login_credentials where email_id = $1', [email_id]);
//         if (result.rows.length === 0) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const user = result.rows[0];
//         // console.log(user)
//         const match = await bcrypt.compare(password, user.password);

//         if (!match) {
//             return res.status(401).json({ message: 'Invalid distributor ID or password' });
//         }
//             // console.log(req.sessionID)
        
//         // Set session ID in the cookie
//         res.cookie('session_id', req.sessionID, {
//             httpOnly: false,
//             secure: process.env.NODE_ENV === 'production', // Set to true only in production with HTTPS
//             maxAge: 3600000, // 1 hour
//         });
//         console.log("Cookies session set after login:", req.cookies);

//         // Set user ID in the cookie
//         res.cookie('user_id', user.distributor_id, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production', // Set to true only in production with HTTPS
//             // maxAge: 3600000, // 1 hour
//         });

//         console.log("Cookies  user set after login:", req.cookies);

//         res.status(200).json({ message: 'Login successful' });
//     } catch (err) {
//         console.error('Login error:', err); // Log the error for debugging
//         res.status(500).json({ message: 'Error logging in', error: err.message });
//     }
// }


// );


// router.post('/logout', (req, res) => {
//     console.log(req.body)
//     console.log("Before logout, cookies:", req.cookies);
//      const {user_id,session_id}=req.cookies;
//     // Destroy the session to ensure session cookies are removed
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Error destroying session:', err);
//             return res.status(500).json({ message: 'Error logging out' });
//         }

//         // Clear user_id cookie
//         res.clearCookie('user_id',user_id, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'None',
//         });

//         // Clear session cookie
//         res.clearCookie('session_id',session_id, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'None',
//         });

//         console.log("After logout, cookies:", req.cookies);
//         res.status(200).json({ message: 'Logout successful' });
//     });
// });


// const CryptoJS = require('crypto-js');
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');
// const Session = require('../models/sessionModel');
// const authenticate = require('../middleware/authMiddleWare1');
// const { query } = require('../db/db');
// const csvParser = require('csv-parser');
// const fs = require('fs');
// const crypto = require('crypto');

// const router = express.Router();



// router.post('/register', async (req, res) => {
//     const { emp_id, name, email, password, role, department, access_list } = req.body;
  
//     try {
//       // Check if the email already exists
//       const existingUser = await User.findByEmail(email);
//       if (existingUser) {
//         return res.status(400).json({ message: 'Email already exists.' });
//       }
  
//       // Register the new user, the encryption will be handled in the register function
//       const newUser = await User.register({
//         emp_id,
//         name,
//         email,
//         password,  // Pass plain password here
//         role,
//         department,
//         access_list,
//       });
  
//       res.status(201).json({ message: 'User registered successfully', user: newUser });
//     } catch (error) {
//       console.error('Error in register:', error.message);
//       res.status(500).json({ message: 'Error registering user.' });
//     }
//   });
  
 
//   router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
  
  
//     try {
//       const user = await User.findByEmail(email);
//       if (!user) {
//         return res.status(400).json({ message: 'Invalid credentials.' });
//       }
  
//       // Decrypt the stored password
//       const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
//       const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
  
//       // Compare decrypted password with the input password
//       if (decryptedPassword !== password) {
//         return res.status(400).json({ message: 'Invalid credentials.' });
//       }
  
//       // Invalidate previous session
//       await Session.deleteSessionByEmpId(user.emp_id);
  
//       // Generate JWT token
//       const token = jwt.sign(
//         { emp_id: user.emp_id, email: user.email, role: user.role, department:user.department,access_list:user.access_list },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//       );
  
  
//       // Create a new session
//       const session_id = `${user.emp_id}_${Date.now()}`;
//       const created_at = new Date();
//       const updated_at = created_at;
  
//       await Session.createSession({
//         session_id,
//         emp_id: user.emp_id,
//         token,
//         created_at,
//         updated_at,
//       });
  
  
//       res.cookie('jwt', token, { httpOnly: true, secure: false });
  
//       res.json({ message: 'Login successful', token });
//     } catch (error) {
//       console.error('Error in login:', error.message);
//       res.status(500).json({ message: 'Error logging in.' });
//     }
//   });
  
 
//   router.post('/logout', authenticate, async (req, res) => {
//       try {
//           const { emp_id } = req.user;
//           console.log("token",req.cookies.jwt)
//           // const token = req.cookies.jwt;
//           // Delete the session from the database
//           await Session.deleteSessionByEmpId(emp_id);
  
//           // Clear the JWT cookie
//           res.clearCookie('jwt');
//           res.json({ message: 'Logged out successfully.' });
//       } catch (error) {
//           console.error('Error in logout:', error.message);
//           res.status(500).json({ message: 'Error logging out.' });
//       }
//   });

// module.exports = router;




const CryptoJS = require('crypto-js');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../controller/userController');
const Session = require('../controller/sessionContoller');
const authenticate = require('../middleware/authMiddleWare');
const { query } = require('../db/db');
const csvParser = require('csv-parser');
const fs = require('fs');
const crypto = require('crypto');
const router = express.Router();



router.post('/register', async (req, res) => {
    const { emp_id, name, email, password, role, department, access_list } = req.body;

    console.log(req.body); // Log the incoming registration data for debugging.

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const newUser = await User.register({
            emp_id,
            name,
            email,
            password,
            role,
            department,
            access_list,
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error in register:', error.message);
        res.status(500).json({ message: 'Error registering user.' });
    }
});




router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
  
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
  
      // Decrypt the stored password
      const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
      console.log(process.env.SECRET_KEY)
      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
  
      // Compare decrypted password with the input password
      if (decryptedPassword !== password) {
        console.log("Password not mathed")
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
  
      // Invalidate previous session
      console.log("Password Matched")

      const sesres = await Session.deleteSessionByEmpId(user.emp_id);
  
      console.log(

        user.emp_id, user.email,  user.role,user.department,user.access_list,
        process.env.JWT_SECRET
      )
      // Generate JWT token
      const token = jwt.sign(
        { emp_id: user.emp_id, email: user.email, role: user.role, department:user.department,access_list:user.access_list },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
  
      // Create a new session
      const session_id = `${user.emp_id}_${Date.now()}`;
      const created_at = new Date();
      const updated_at = created_at;
  
      await Session.createSession({
        session_id,
        emp_id: user.emp_id,
        token,
        created_at,
        updated_at,
      });
  
  
      res.cookie('jwt', token, { httpOnly: false, secure: true });
  
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error in login:', error.message);
      res.status(500).json({ message: 'Error logging in.' });
    }
  });



// Logout route
router.post('/logout', authenticate, async (req, res) => {
    try {
        const { emp_id } = req.user;
        console.log(emp_id)
        const resses= await Session.deleteSessionByEmpId(emp_id);
        console.log(resses)
        res.clearCookie('jwt');
        res.json({ message: 'Logged out successfully.' });
    } catch (error) {
        console.error('Error in logout:', error.message);
        res.status(500).json({ message: 'Error logging out.' });
    }
});

module.exports = router;
