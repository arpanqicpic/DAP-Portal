const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/db');
// const Middleware=require('../middleware/authMiddleWare')
const router = express.Router();
const cookieParser=require('cookie-parser');

// Route for registering a new user

router.use(cookieParser());

router.post('/register', async (req, res) => {
    const { distributor_id, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'insert into iris_sb_test.distributor_login_credentials (distributor_id ,password ) VALUES ($1, $2) RETURNING distributor_id',
            [distributor_id, hashedPassword]
        );

        console.log(hashedPassword)
        res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id, hashedPassword });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});




router.post('/login', async (req, res) => {
    const { email_id, password } = req.body;
    console.log(req.body)
    // console.log('Password:', JSON.stringify(password));
    // console.log(typeof(password))
    try {
        const result = await pool.query('select * from iris_sb_test.distributor_login_credentials where email_id = $1', [email_id]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid distributor ID or password' });
        }
        const user = result.rows[0];
        console.log(result.rows[0])
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Invalid distributor ID or password' });
        }
            console.log(req.sessionID)
        
        // Set session ID in the cookie
        res.cookie('sessionID', req.sessionID, {
            httpOnly: false,
            secure: process.env.SESSION_SECRET === 'production', // Set to true only in production with HTTPS
            maxAge: 3600000, // 1 hour
        });
        console.log("Cookies set after login:", req.cookies);

        // Set user ID in the cookie
        res.cookie('user_id', user.distributor_id, {
            httpOnly: false,
            secure: process.env.SESSION_SECRET === 'production', // Set to true only in production with HTTPS
            // maxAge: 3600000, // 1 hour
        });

        console.log("Cookies set after login:", req.cookies);

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Login error:', err); // Log the error for debugging
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
}


);

// router.post('/login', async (req, res) => {
//     const { email_id, password } = req.body;
//     console.log(req.body);

//     try {
//         const result = await pool.query('SELECT * FROM iris_sb_test.distributor_login_credentials WHERE email_id = $1', [email_id]);
        
//         if (result.rows.length === 0) {
//             return res.status(401).json({ message: 'Invalid distributor ID or password' });
//         }

//         const user = result.rows[0];
//         console.log(user);

//         const match = await bcrypt.compare(password, user.password);

//         if (!match) {
//             return res.status(401).json({ message: 'Invalid distributor ID or password' });
//         }
        
//         // Set session ID in the cookie
//         res.cookie('sessionID', req.sessionID, {
//             httpOnly: true,
//             secure: process.env.SESSION_SECRET === 'production', // Set to true only in production with HTTPS
//             maxAge: 3600000, // 1 hour
//         });

//         // Set user ID in the cookie
//         res.cookie('user_id', user.distributor_id, {
//             httpOnly: true,
//             secure: process.env.SESSION_SECRET === 'production', // Set to true only in production with HTTPS
//             maxAge: 3600000, // 1 hour
//         });

//         console.log("Cookies set after login:", req.cookies);

//         res.status(200).json({ message: 'Login successful' });
//     } catch (err) {
//         console.error('Login error:', err); // Log the error for debugging
//         res.status(500).json({ message: 'Error logging in', error: err.message });
//     }
// });


router.post('/logout', (req, res) => {
    console.log(req.body)
    console.log("Before logout, cookies:", req.cookies);
     const {user_id,session_id}=req.cookies;
    // Destroy the session to ensure session cookies are removed
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }

        // Clear user_id cookie
        res.clearCookie('user_id',user_id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        });

        // Clear session cookie
        res.clearCookie('session_id',session_id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        });

        console.log("After logout, cookies:", req.cookies);
        res.status(200).json({ message: 'Logout successful' });
    });
});


module.exports = router;
