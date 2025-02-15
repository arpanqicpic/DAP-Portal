// const { pool } = require('../db/db'); // Ensure correct import

// const Middleware = (req, res, next) => {
//     console.log("Middleware: Checking authentication");
//     const cookie = cookie || {}; // Safe fallback for cookies
//     const { session_id, email_id } = cookie;
//     // console.log(req)
//     console.log("sessionId", req.sessionID); // Debugging cookies
//     console.log('User ID:', email_id);
    

//     async function sessionVerify(sessionID, email_id) {
//         try {
//             const result = await pool.query('SELECT session_id FROM sesusers WHERE distributor_id = $1', [email_id]);
//             if (result.rows.length > 0 && result.rows[0].session_id === sessionID) {
//                 return true;
//             } else {
//                 return false;
//             }
//         } catch (err) {
//             console.error("Error in sessionVerify:", err);
//             return false;
//         }
//     }

//     if (session_id) {
//         sessionVerify(session_id).then(isValid => {
//             if (isValid) {
//                 console.log("Authenticated user found. Proceeding...");
//                 return next();
//             } else {
//                 console.log("Session Expired");
//                 return res.status(401).json({ message: 'Session expired. Please log in again.' });
//             }
//         }).catch(err => {
//             console.error("Error in session verification:", err);
//             return res.status(500).json({ message: 'Error verifying session.' });
//         });
//     } else {
//         console.log("User is not authenticated.");
//         return res.status(401).json({ message: 'Unauthorized. Please log in to access this resource.' });
//     }
// };

// module.exports = { Middleware };




const { pool } = require('../db/db'); // Ensure correct import

const Middleware = (req, res, next) => {
   
    console.log(req)
    const { sessionID, user_id } = req.cookies;

    // Debugging logs
    // console.log("Cookies: ", req.cookies); // Log entire cookies object

    // Verify session in the database
    async function sessionVerify(sessionID, user_id) {
        try {
            const result = await pool.query('SELECT session_id FROM sesusers WHERE distributor_id = $1', [user_id]);
            if (result.rows.length > 0 && result.rows[0].session_id === sessionID) {
                return true; // Session is valid
            } else {
                return false; // Session is not valid
            }
        } catch (err) {
            console.error("Error in sessionVerify:", err);
            return false; // Error in session verification
        }
    }

    // Check if session ID and user_id exist in cookies
    if (sessionID && user_id) {
        sessionVerify(sessionID, user_id).then(isValid => {
            if (isValid) {
                console.log("Authenticated user found. Proceeding...");
                return next(); // Proceed to the next middleware or route handler
            } else {
                console.log("Session expired or invalid.");
                return res.status(401).json({ message: 'Session expired or invalid. Please log in again.' });
            }
        }).catch(err => {
            console.error("Error in session verification:", err);
            return res.status(500).json({ message: 'Error verifying session.' });
        });
    } else {
        console.log("User is not authenticated. Missing session ID or user_id.");
        return res.status(401).json({ message: 'Unauthorized. Please log in to access this resource.' });
    }
};

// module.exports =  Middleware ;
