// const jwt = require('jsonwebtoken');
// const Session = require('../models/sessionModel');

// const authenticate = async (req, res, next) => {

//   console.log(req)

//   const token = req.cookies.jwt;

//   // console.log("token-",token)

//   if (!token) {
//     return res.status(403).json({ message: 'Access Denied. No token provided.' });
//   }

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);

//     // Check if the session exists
//     const session = await Session.findSessionByEmpId(verified.emp_id);
    

//     if (!session || session.session_token !== token) {
//       return res.status(403).json({ message: 'Session expired or invalid.' });
//     }
//     // Check for inactivity (1 hour)
//     const lastActivity = new Date(session.last_activity);
//     const now = new Date();
//     if (now - lastActivity > 60 * 60 * 1000) {
//       await Session.deleteSessionByEmpId(verified.emp_id);
//       return res.status(403).json({ message: 'Session expired due to inactivity.' });
//     }
//     // Update last activity timestamp
//     await Session.updateLastActivity(verified.emp_id);
//     req.user = verified;
//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: 'Invalid token.' });
//   }
// };

// module.exports = authenticate;


// const jwt = require('jsonwebtoken');
// const Session = require('../controller/sessionContoller');

// const authenticate = async (req, res, next) => {
//   const token = req.cookies.jwt;
  

//   if (!token) {
//     return res.status(403).json({ message: 'Access Denied. No token provided.' });
//   }

//   try {
//     // Verify JWT
//     const verified = jwt.verify(token, process.env.JWT_SECRET);

//     // Check if the session exists for the user
//     const session = await Session.findSessionByEmpId(verified.emp_id);
//     if (!session || session.session_token !== token) {
//       return res.status(403).json({ message: 'Session expired or invalid.' });
//     }

//     // Check for token expiration date
//     const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
//     if (verified.exp < now) {
//       return res.status(403).json({ message: 'Token has expired.' });
//     }

//     // Check for inactivity (1 hour timeout)
//     const lastActivity = new Date(session.last_activity).getTime();
//     const currentTime = Date.now();
//     if (currentTime - lastActivity > 60 * 60 * 1000) {
//       // Session expired due to inactivity
//       await Session.deleteSessionByEmpId(verified.emp_id);
//       return res.status(403).json({ message: 'Session expired due to inactivity.' });
//     }

//     // Update the last activity timestamp for the session
//     await Session.updateLastActivity(verified.emp_id);

//     // Attach user info to the request object
//     req.user = verified;

//     // Proceed to the next middleware/route handler
//     next();
//   } catch (err) {
//     console.error('Authentication error:', err);
//     return res.status(400).json({ message: 'Invalid token.' });
//   }
// };

// // module.exports = authenticate;
