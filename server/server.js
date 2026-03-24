// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const multer = require('multer'); 
// const path = require('path');     
// const nodemailer = require('nodemailer'); 
// const fs = require('fs'); // Added for mkdirSync

// // --- Models ---
// const User = require('./models/User');
// const Session = require('./models/Session');
// const Transaction = require('./models/Transaction');
// const Message = require('./models/Message'); 

// // 🚨 Notification Model
// const NotificationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   type: { type: String, required: true }, // 'booking', 'message', 'system'
//   text: { type: String, required: true },
//   isRead: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now }
// });
// const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

// // 🚨 Settings Model
// const settingsSchema = new mongoose.Schema({
//     siteName: { type: String, default: 'SkillSphere' },
//     maintenanceMode: { type: Boolean, default: false },
//     emailAlerts: { type: Boolean, default: true },
//     featuredSkills: { type: [String], default: ['React', 'Python', 'Design'] }
// });
// const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

// const app = express();
// const server = http.createServer(app);

// // --- Middleware ---
// app.use(cors({ 
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     return callback(null, true);
//   },
//   credentials: true 
// }));
// app.use(express.json());
// // Serve static files from uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// // Also explicitly serve the chat subdirectory
// app.use('/uploads/chat', express.static(path.join(__dirname, 'uploads/chat')));

// // Add CORS headers for static files
// app.use('/uploads', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET');
//   next();
// });
// // --- MULTER CONFIG ---
// // Create chat upload directory
// const chatUploadDir = path.join(__dirname, "uploads/chat");
// fs.mkdirSync(chatUploadDir, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
// const upload = multer({ storage });

// // Chat file upload storage
// const chatStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, chatUploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
// const chatUpload = multer({ storage: chatStorage });

// // --- NODEMAILER CONFIG ---
// const transporter = nodemailer.createTransport({
//   service: 'gmail', 
//   auth: {
//     user: process.env.EMAIL_USER, 
//     pass: process.env.EMAIL_PASS  
//   }
// });

// // --- Database Connection ---
// mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skill_exchange')
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => console.error('❌ DB Error:', err));

// // --- Socket.io Setup ---
// const io = new Server(server, {
//   cors: { 
//     origin: "*", 
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// app.set('io', io);

// // 🚨 STATE TRACKING 🚨
// const waitingRooms = new Set();
// const socketToRoom = new Map(); 
// // 🚨 ONLINE USERS TRACKING 🚨
// const onlineUsers = new Set();

// io.on('connection', (socket) => {
//   console.log("Socket Connected:", socket.id);
//   socket.emit('me', socket.id);

//   socket.on('join_chat', async (userId) => { 
//     socket.join(userId);
    
//     // ADD USER TO ONLINE LIST
//     onlineUsers.add(userId.toString());
    
//     // SEND ONLINE USERS TO ALL CLIENTS
//     io.emit("online_users", Array.from(onlineUsers));
    
//     try {
//         const mySessions = await Session.find({ $or: [{ learner: userId }, { mentor: userId }] });
//         mySessions.forEach(session => {
//             if (waitingRooms.has(session.roomId)) {
//                 socket.emit('partner_active', { roomId: session.roomId });
//             }
//         });
//     } catch (err) { console.error("Sync Error:", err); }
//   });

//   socket.on('join_room', (roomId) => { 
//     socket.join(roomId); 
//     socket.to(roomId).emit("user_joined", socket.id);
//   });

//   socket.on('user_entered_room', async ({ roomId, userId }) => {
//       try {
//           waitingRooms.add(roomId);
//           socketToRoom.set(socket.id, roomId);

//           const session = await Session.findOne({ roomId });
//           if (session) {
//               const partnerId = session.learner.toString() === userId 
//                   ? session.mentor.toString() 
//                   : session.learner.toString();
//               io.to(partnerId).emit('partner_active', { roomId });
//           }
//       } catch (err) { console.error(err); }
//   });

//   // Typing indicators
//   socket.on('typing', ({ to, from }) => {
//     io.to(to).emit('typing', { from });
//   });

//   socket.on('stop_typing', ({ to, from }) => {
//     io.to(to).emit('stop_typing', { from });
//   });

//   const notifyPartnerExit = async (roomId) => {
//       try {
//           waitingRooms.delete(roomId); 
//           const session = await Session.findOne({ roomId });
//           if (session) {
//               io.to(session.learner.toString()).emit('partner_inactive', { roomId });
//               io.to(session.mentor.toString()).emit('partner_inactive', { roomId });
//           }
//       } catch (e) { console.error(e); }
//   };

//   socket.on("end_call", (data) => {
//     notifyPartnerExit(data.roomId); 
//     socket.to(data.roomId).emit("callEnded");
//     socket.leave(data.roomId);
//   });

//   socket.on('disconnect', () => { 
//     const roomId = socketToRoom.get(socket.id);
//     if (roomId) {
//         socketToRoom.delete(socket.id);
//         notifyPartnerExit(roomId); 
//     }
    
//     // REMOVE USER FROM ONLINE LIST
//     onlineUsers.forEach(userId => {
//         // Check if this socket was part of that user's connections
//         const rooms = io.sockets.adapter.rooms.get(userId);
//         if (!rooms || !rooms.has(socket.id)) {
//             // This socket wasn't in that user's room
//         }
//     });
    
//     // Alternative: We need to track which user this socket belongs to
//     // For now, let's emit the current online users (this will be updated on next join)
//     io.emit("online_users", Array.from(onlineUsers));
    
//     socket.broadcast.emit("callEnded"); 
//   });

//   socket.on('tell_new_user_i_am_here', (data) => { io.to(data.to).emit("active_user_exist", { from: data.from }); });
  
//   socket.on("callUser", (data) => { 
//     io.to(data.userToCall).emit("callUser", { 
//         signal: data.signalData, 
//         from: data.from, 
//         name: data.name 
//     }); 
//   });
  
//   socket.on("answerCall", (data) => { 
//     io.to(data.to).emit("callAccepted", data.signal); 
//   });
// });

// // ==========================================
// //              MIDDLEWARES
// // ==========================================

// const verifyToken = async (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) return res.status(403).json({ error: "No token provided" });
  
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(404).json({ error: "User not found" });
//     if (user.isBanned) return res.status(403).json({ error: "You are banned. Contact Admin." });

//     req.userId = user._id;
//     req.userRole = user.role; 
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
// };

// const verifyAdmin = (req, res, next) => {
//   if (req.userRole !== 'admin') return res.status(403).json({ error: "Access denied. Admins only." });
//   next();
// };

// // ==========================================
// //               AUTH ROUTES
// // ==========================================

// app.get('/api/auth/me', verifyToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select('-password');
//     const isOnboardedStatus = user.role === 'admin' ? true : user.isOnboarded;
//     res.json({ 
//         id: user._id, name: user.name, email: user.email,
//         balance: user.walletBalance, role: user.role, avatar: user.avatar, 
//         isOnboarded: isOnboardedStatus, skills: user.skills || [],
//         learningInterests: user.learningInterests || []
//     });
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body; 
//     const existing = await User.findOne({ email });
//     if(existing) return res.status(400).json({error: "Email exists"});
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashedPassword, role: 'user', walletBalance: 100, isOnboarded: false, isBanned: false });
    
//     const io = req.app.get('io');
//     if (io) io.emit('new_user_registered', { id: user._id, name: user.name, email: user.email });

//     res.status(201).json({ message: "User created", userId: user._id });
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: 'User not found' });
//     if (user.isBanned) return res.status(403).json({ error: 'You are banned.' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
//     const isOnboardedStatus = user.role === 'admin' ? true : user.isOnboarded;

//     res.json({ token, user: { id: user._id, name: user.name, balance: user.walletBalance, role: user.role, avatar: user.avatar, isOnboarded: isOnboardedStatus } });
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.post('/api/auth/forgot-password', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
//     const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

//     await transporter.sendMail({
//       from: `"SkillSphere" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Reset Your Password",
//       html: `<h3>Password Reset Request</h3><p>Click below to reset:</p><a href="${resetLink}">Reset Password</a>`
//     });
//     res.json({ message: "Reset link sent" });
//   } catch (err) { res.status(500).json({ error: "Email failed" }); }
// });

// app.post('/api/auth/reset-password', async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
//     res.json({ message: "Password updated" });
//   } catch (err) { res.status(400).json({ error: "Invalid token" }); }
// });

// // ==========================================
// //               USER & PROFILE
// // ==========================================

// app.post('/api/users/onboard', verifyToken, async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.body.userId, { ...req.body, isOnboarded: true }, { new: true });
//     res.json(user);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.get('/api/users/mentors', async (req, res) => {
//   try {
//     const mentors = await User.find({ 
//         skills: { $exists: true, $not: { $size: 0 } },
//         role: { $ne: 'admin' }, 
//         isBanned: { $ne: true } 
//     }).select('-password');
//     res.json(mentors);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.put('/api/users/profile', verifyToken, upload.single('avatar'), async (req, res) => {
//   try {
//     const { userId, name, skills, learningInterests, bio, hourlyRate } = req.body;
//     let updateData = {};
//     if (name) updateData.name = name;
//     if (bio !== undefined) updateData.bio = bio;
//     if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;

//     if (skills) updateData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
//     if (learningInterests) updateData.learningInterests = typeof learningInterests === 'string' ? JSON.parse(learningInterests) : learningInterests;
//     if (req.file) updateData.avatar = `http://localhost:5000/uploads/${req.file.filename}`;

//     const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
//     res.json(user);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // ==========================================
// //                SESSIONS
// // ==========================================

// app.post('/api/sessions/book', verifyToken, async (req, res) => {
//   try {
//     const { learnerId, mentorId, skill, duration, startTime } = req.body;
//     const learner = await User.findById(learnerId);
//     const mentor = await User.findById(mentorId);
    
//     if (mentor.role === 'admin' || mentor.isBanned) return res.status(403).json({ error: "Invalid mentor" });

//     const start = new Date(startTime);
//     const end = new Date(start.getTime() + (parseInt(duration) * 60 * 1000)); 
//     const conflict = await Session.findOne({ mentor: mentorId, status: 'scheduled', $or: [ { startTime: { $lt: end }, endTime: { $gt: start } } ] });
    
//     if (conflict) return res.status(400).json({ error: "Time slot conflict." });
//     if (learner.walletBalance < 20) return res.status(400).json({ error: "Insufficient funds" });
    
//     learner.walletBalance -= 20; await learner.save();
//     mentor.walletBalance += 20; await mentor.save();

//     const newSession = await Session.create({ 
//       learner: learnerId, mentor: mentorId, skill, startTime: start, endTime: end, duration: parseInt(duration), cost: 20, status: 'scheduled', roomId: `room_${Date.now()}` 
//     });

//     await Transaction.create({ user: learnerId, amount: -20, type: 'payment', description: `Session with ${mentor.name}` });
//     await Transaction.create({ user: mentorId, amount: 20, type: 'earning', description: `Session with ${learner.name}` });
    
//     io.to(learnerId.toString()).emit('session_update');
//     io.to(mentorId.toString()).emit('session_update');
//     io.to(mentorId.toString()).emit('receive_notification', { text: `📅 New Booking: ${skill} session`, type: 'booking' });
    
//     res.json(newSession);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.get('/api/sessions/:userId', verifyToken, async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     await Session.updateMany({ $or: [{ learner: userId }, { mentor: userId }], status: 'scheduled', endTime: { $lt: new Date() } }, { $set: { status: 'missed' } });
//     const sessions = await Session.find({ $or: [{ learner: userId }, { mentor: userId }] }).populate('mentor', 'name').populate('learner', 'name').sort({ startTime: 1 });
//     res.json(sessions);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.post('/api/sessions/review', verifyToken, async (req, res) => {
//   try {
//     const { sessionId, rating, comment } = req.body;
//     const sess = await Session.findByIdAndUpdate(sessionId, { review: { rating, comment }, reviewedAt: new Date(), status: 'completed' }, { new: true });
    
//     const mentor = await User.findById(sess.mentor);
//     if(mentor) {
//         mentor.rating = ((mentor.rating * mentor.totalReviews) + Number(rating)) / (mentor.totalReviews + 1);
//         mentor.totalReviews += 1;
//         await mentor.save();
//     }
//     io.to(sess.learner.toString()).emit('session_update');
//     io.to(sess.mentor.toString()).emit('session_update');
//     waitingRooms.delete(sess.roomId); 
//     res.json({ message: 'Review submitted' });
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // ==========================================
// //           MESSAGES & WALLET
// // ==========================================

// // File upload for chat
// app.post('/api/messages/upload', verifyToken, chatUpload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }
    
//     // Generate the URL
//     const baseUrl = `${req.protocol}://${req.get('host')}`;
//     const fileUrl = `${baseUrl}/uploads/chat/${req.file.filename}`;
    
//     // Return consistent attachment object
//     res.json({
//       url: fileUrl,
//       name: req.file.originalname,
//       type: req.file.mimetype,
//       size: req.file.size
//     });
//   } catch (err) {
//     console.error('Upload error:', err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });

// // Read receipts
// app.post('/api/messages/read/:userId/:contactId', verifyToken, async (req, res) => {
//   const { userId, contactId } = req.params;
//   await Message.updateMany(
//     {
//       sender: contactId,
//       receiver: userId,
//       read: false
//     },
//     {
//       $set: { read: true }
//     }
//   );
//   res.json({ success: true });
// });

// app.post('/api/messages', verifyToken, async (req, res) => {
//     try {
//         const { sender, receiver, text, attachment } = req.body;
        
//         // Create message with proper attachment object
//         const msgData = {
//             sender,
//             receiver,
//             text: text || ''
//         };
        
//         // Only add attachment if it exists and has required fields
//         if (attachment && attachment.url) {
//             msgData.attachment = {
//                 url: attachment.url,
//                 name: attachment.name || 'attachment',
//                 type: attachment.type || 'application/octet-stream'
//             };
//         }
        
//         const msg = await Message.create(msgData);
        
//         // Populate sender info
//         const populatedMsg = await Message.findById(msg._id)
//             .populate('sender', 'name avatar');
        
//         console.log('📨 Emitting message with attachment to receiver:', receiver);
        
//         // Get io instance
//         const io = req.app.get('io');
        
//         // Emit to receiver
//         if (io) {
//             io.to(receiver.toString()).emit('receive_chat', populatedMsg);
//         }
        
//         res.json(populatedMsg);
//     } catch (err) {
//         console.error('Message error:', err);
//         res.status(500).json({ error: err.message });
//     }
// });

// app.get('/api/messages/contacts/:userId', verifyToken, async (req, res) => {
//     const { userId } = req.params;
//     const sent = await Message.find({ sender: userId }).distinct('receiver');
//     const received = await Message.find({ receiver: userId }).distinct('sender');
//     const sessions = await Session.find({ $or: [{ learner: userId }, { mentor: userId }] });
//     const sessionContacts = sessions.map(s => s.learner?.toString() === userId ? s.mentor?.toString() : s.learner?.toString()).filter(Boolean);
//     const allIds = [...new Set([...sent.map(String), ...received.map(String), ...sessionContacts])];
    
//     const contacts = await User.find({ _id: { $in: allIds }, role: { $ne: 'admin' }, isBanned: { $ne: true } }).select('name avatar email role');
//     res.json(contacts);
// });

// app.get('/api/messages/:user1/:user2', verifyToken, async (req, res) => {
//     try {
//         const msgs = await Message.find({ 
//             $or: [
//                 { sender: req.params.user1, receiver: req.params.user2 },
//                 { sender: req.params.user2, receiver: req.params.user1 }
//             ] 
//         })
//         .sort({ createdAt: 1 })
//         .populate('sender', 'name avatar')
//         .populate('receiver', 'name avatar');
        
//         res.json(msgs);
//     } catch (err) {
//         console.error('Error fetching messages:', err);
//         res.status(500).json({ error: err.message });
//     }
// });

// app.get('/api/wallet/history/:userId', verifyToken, async (req, res) => {
//     const history = await Transaction.find({ user: req.params.userId }).sort({ date: -1 });
//     res.json(history);
// });

// // ==========================================
// //                ADMIN ROUTES
// // ==========================================

// app.get('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
//     const users = await User.find({}).select('-password');
//     res.json(users);
// });

// app.put('/api/admin/ban/:userId', verifyToken, verifyAdmin, async (req, res) => {
//     const user = await User.findById(req.params.userId);
//     user.isBanned = !user.isBanned; 
//     await user.save();
//     res.json({ isBanned: user.isBanned });
// });

// app.get('/api/admin/stats', verifyToken, verifyAdmin, async (req, res) => {
//     const totalUsers = await User.countDocuments();
//     const totalSessions = await Session.countDocuments();
//     const totalVolume = await Transaction.aggregate([
//       { $match: { amount: { $gt: 0 } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);
//     res.json({ totalUsers, totalSessions, volume: totalVolume[0]?.total || 0 });
// });

// app.get('/api/admin/reviews', verifyToken, verifyAdmin, async (req, res) => {
//     const reviews = await Session.find({ "review.rating": { $exists: true } })
//         .populate('learner', 'name avatar').populate('mentor', 'name avatar').sort({ reviewedAt: -1 });
//     res.json(reviews);
// });

// app.get('/api/admin/sessions', verifyToken, verifyAdmin, async (req, res) => {
//     const sessions = await Session.find({}).populate('learner', 'name email').populate('mentor', 'name email').sort({ startTime: -1 });
//     res.json(sessions);
// });

// app.get('/api/admin/settings', verifyToken, verifyAdmin, async (req, res) => {
//     let s = await Settings.findOne();
//     if (!s) s = await Settings.create({});
//     res.json(s);
// });

// app.put('/api/admin/settings', verifyToken, verifyAdmin, async (req, res) => {
//     const s = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
//     res.json(s);
// });

// app.get('/api/admin/analytics', verifyToken, verifyAdmin, async (req, res) => {
//     try {
//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//         const revenueStats = await Session.aggregate([
//             { $match: { status: 'completed', startTime: { $gte: sevenDaysAgo } } },
//             { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } }, dailyTotal: { $sum: "$cost" } } },
//             { $sort: { _id: 1 } }
//         ]);

//         const topSkills = await Session.aggregate([
//             { $match: { status: 'completed' } },
//             { $group: { _id: "$skill", count: { $sum: 1 } } },
//             { $sort: { count: -1 } },
//             { $limit: 5 }
//         ]);

//         const topMentors = await Session.aggregate([
//             { $match: { status: 'completed' } },
//             { $group: { _id: "$mentor", totalEarned: { $sum: "$cost" }, sessionsCount: { $sum: 1 } } },
//             { $sort: { totalEarned: -1 } },
//             { $limit: 3 },
//             { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "m" } },
//             { $unwind: "$m" },
//             { $project: { name: "$m.name", avatar: "$m.avatar", totalEarned: 1, sessionsCount: 1 } }
//         ]);

//         res.json({ revenueStats, skills: topSkills.map(s => ({ name: s._id, count: s.count })), topMentors });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.post('/api/admin/communicate', verifyToken, verifyAdmin, async (req, res) => {
//     const { type, target, subject, message } = req.body;
//     try {
//         let query = {};
//         if (target === 'banned') query = { isBanned: true };
//         const recipients = await User.find(query).select('_id');
//         const notifs = recipients.map(u => ({ userId: u._id, type: 'system', text: `${subject}: ${message}` }));
//         if (notifs.length > 0) await Notification.insertMany(notifs);
        
//         io.emit('receive_notification', { type: 'system', text: `📢 ${subject}: ${message}` });
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ error: "Comm failed" }); }
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer'); 
const path = require('path');     
const nodemailer = require('nodemailer'); 
const fs = require('fs'); // Added for mkdirSync

// --- Models ---
const User = require('./models/User');
const Session = require('./models/Session');
const Transaction = require('./models/Transaction');
const Message = require('./models/Message'); 

// 🚨 Notification Model
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // 'booking', 'message', 'system'
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

// 🚨 Settings Model
const settingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'SkillSphere' },
    maintenanceMode: { type: Boolean, default: false },
    emailAlerts: { type: Boolean, default: true },
    featuredSkills: { type: [String], default: ['React', 'Python', 'Design'] }
});
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

const app = express();
const server = http.createServer(app);

// --- Middleware ---
app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true 
}));
app.use(express.json());
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Also explicitly serve the chat subdirectory
app.use('/uploads/chat', express.static(path.join(__dirname, 'uploads/chat')));

// Add CORS headers for static files
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});
// --- MULTER CONFIG ---
// Create chat upload directory
const chatUploadDir = path.join(__dirname, "uploads/chat");
fs.mkdirSync(chatUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Chat file upload storage
const chatStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, chatUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const chatUpload = multer({ storage: chatStorage });

// --- NODEMAILER CONFIG ---
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillsphere')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

// --- Socket.io Setup ---
const io = new Server(server, {
  cors: { 
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set('io', io);

// 🚨 STATE TRACKING 🚨
const waitingRooms = new Set();
const socketToRoom = new Map(); 
// 🚨 ONLINE USERS TRACKING 🚨
const onlineUsers = new Set();

io.on('connection', (socket) => {
  console.log("Socket Connected:", socket.id);
  socket.emit('me', socket.id);

  socket.on('join_chat', async (userId) => {
    // Store userId on socket for later removal
    socket.userId = userId;
    socket.join(userId);
    
    // ADD USER TO ONLINE LIST
    onlineUsers.add(userId.toString());
    
    // SEND ONLINE USERS TO ALL CLIENTS
    io.emit("online_users", Array.from(onlineUsers));
    
    try {
        const mySessions = await Session.find({ $or: [{ learner: userId }, { mentor: userId }] });
        mySessions.forEach(session => {
            if (waitingRooms.has(session.roomId)) {
                socket.emit('partner_active', { roomId: session.roomId });
            }
        });
    } catch (err) { console.error("Sync Error:", err); }
  });

  socket.on('join_room', (roomId) => { 
    socket.join(roomId); 
    socket.to(roomId).emit("user_joined", socket.id);
  });

  socket.on('user_entered_room', async ({ roomId, userId }) => {
      try {
          waitingRooms.add(roomId);
          socketToRoom.set(socket.id, roomId);

          const session = await Session.findOne({ roomId });
          if (session) {
              const partnerId = session.learner.toString() === userId 
                  ? session.mentor.toString() 
                  : session.learner.toString();
              io.to(partnerId).emit('partner_active', { roomId });
          }
      } catch (err) { console.error(err); }
  });

  // Typing indicators
  socket.on('typing', ({ to, from }) => {
    io.to(to).emit('typing', { from });
  });

  socket.on('stop_typing', ({ to, from }) => {
    io.to(to).emit('stop_typing', { from });
  });

  const notifyPartnerExit = async (roomId) => {
      try {
          waitingRooms.delete(roomId); 
          const session = await Session.findOne({ roomId });
          if (session) {
              io.to(session.learner.toString()).emit('partner_inactive', { roomId });
              io.to(session.mentor.toString()).emit('partner_inactive', { roomId });
          }
      } catch (e) { console.error(e); }
  };

  socket.on("end_call", (data) => {
    notifyPartnerExit(data.roomId); 
    socket.to(data.roomId).emit("callEnded");
    socket.leave(data.roomId);
  });

  socket.on('disconnect', () => { 
    const roomId = socketToRoom.get(socket.id);
    if (roomId) {
        socketToRoom.delete(socket.id);
        notifyPartnerExit(roomId); 
    }
    
    // REMOVE USER FROM ONLINE LIST using stored userId
    if (socket.userId) {
        onlineUsers.delete(socket.userId.toString());
        io.emit("online_users", Array.from(onlineUsers));
    }
    
    socket.broadcast.emit("callEnded"); 
  });

  socket.on('tell_new_user_i_am_here', (data) => { io.to(data.to).emit("active_user_exist", { from: data.from }); });
  
  socket.on("callUser", (data) => { 
    io.to(data.userToCall).emit("callUser", { 
        signal: data.signalData, 
        from: data.from, 
        name: data.name 
    }); 
  });
  
  socket.on("answerCall", (data) => { 
    io.to(data.to).emit("callAccepted", data.signal); 
  });
});

// ==========================================
//              MIDDLEWARES
// ==========================================

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isBanned) return res.status(403).json({ error: "You are banned. Contact Admin." });

    req.userId = user._id;
    req.userRole = user.role; 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') return res.status(403).json({ error: "Access denied. Admins only." });
  next();
};

// ==========================================
//               AUTH ROUTES
// ==========================================

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    const isOnboardedStatus = user.role === 'admin' ? true : user.isOnboarded;
    res.json({ 
        id: user._id, name: user.name, email: user.email,
        balance: user.walletBalance, role: user.role, avatar: user.avatar, 
        isOnboarded: isOnboardedStatus, skills: user.skills || [],
        learningInterests: user.learningInterests || []
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body; 
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({error: "Email exists"});
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: 'user', walletBalance: 100, isOnboarded: false, isBanned: false });
    
    const io = req.app.get('io');
    if (io) io.emit('new_user_registered', { id: user._id, name: user.name, email: user.email });

    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.isBanned) return res.status(403).json({ error: 'You are banned.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
    const isOnboardedStatus = user.role === 'admin' ? true : user.isOnboarded;

    res.json({ token, user: { id: user._id, name: user.name, balance: user.walletBalance, role: user.role, avatar: user.avatar, isOnboarded: isOnboardedStatus } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"SkillSphere" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `<h3>Password Reset Request</h3><p>Click below to reset:</p><a href="${resetLink}">Reset Password</a>`
    });
    res.json({ message: "Reset link sent" });
  } catch (err) { res.status(500).json({ error: "Email failed" }); }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.json({ message: "Password updated" });
  } catch (err) { res.status(400).json({ error: "Invalid token" }); }
});

// ==========================================
//               USER & PROFILE
// ==========================================

app.post('/api/users/onboard', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, { ...req.body, isOnboarded: true }, { new: true });
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users/mentors', async (req, res) => {
  try {
    const mentors = await User.find({ 
        skills: { $exists: true, $not: { $size: 0 } },
        role: { $ne: 'admin' }, 
        isBanned: { $ne: true } 
    }).select('-password');
    res.json(mentors);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/users/profile', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    const { userId, name, skills, learningInterests, bio, hourlyRate } = req.body;
    let updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;

    if (skills) updateData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    if (learningInterests) updateData.learningInterests = typeof learningInterests === 'string' ? JSON.parse(learningInterests) : learningInterests;
    if (req.file) updateData.avatar = `http://localhost:5000/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
//                SESSIONS
// ==========================================

app.post('/api/sessions/book', verifyToken, async (req, res) => {
  try {
    const { learnerId, mentorId, skill, duration, startTime } = req.body;
    const learner = await User.findById(learnerId);
    const mentor = await User.findById(mentorId);
    
    if (mentor.role === 'admin' || mentor.isBanned) return res.status(403).json({ error: "Invalid mentor" });
    if (learner.isBanned) return res.status(403).json({ error: "You are banned. Cannot book sessions." });

    const start = new Date(startTime);
    const end = new Date(start.getTime() + (parseInt(duration) * 60 * 1000)); 
    const conflict = await Session.findOne({ mentor: mentorId, status: 'scheduled', $or: [ { startTime: { $lt: end }, endTime: { $gt: start } } ] });
    
    if (conflict) return res.status(400).json({ error: "Time slot conflict." });
    
    // Calculate cost using mentor's hourly rate
    const cost = mentor.hourlyRate * (parseInt(duration) / 60);
    if (learner.walletBalance < cost) return res.status(400).json({ error: `Insufficient funds. Need ${cost} tokens.` });
    
    learner.walletBalance -= cost; await learner.save();
    mentor.walletBalance += cost; await mentor.save();

    const newSession = await Session.create({ 
      learner: learnerId, mentor: mentorId, skill, startTime: start, endTime: end, duration: parseInt(duration), cost, status: 'scheduled', roomId: `room_${Date.now()}` 
    });

    await Transaction.create({ user: learnerId, amount: -cost, type: 'payment', description: `Session with ${mentor.name}` });
    await Transaction.create({ user: mentorId, amount: cost, type: 'earning', description: `Session with ${learner.name}` });
    
    io.to(learnerId.toString()).emit('session_update');
    io.to(mentorId.toString()).emit('session_update');
    io.to(mentorId.toString()).emit('receive_notification', { text: `📅 New Booking: ${skill} session`, type: 'booking' });
    
    res.json(newSession);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/sessions/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    await Session.updateMany({ $or: [{ learner: userId }, { mentor: userId }], status: 'scheduled', endTime: { $lt: new Date() } }, { $set: { status: 'missed' } });
    const sessions = await Session.find({ $or: [{ learner: userId }, { mentor: userId }] }).populate('mentor', 'name').populate('learner', 'name').sort({ startTime: 1 });
    res.json(sessions);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/sessions/review', verifyToken, async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;
    const sess = await Session.findByIdAndUpdate(sessionId, { review: { rating, comment }, reviewedAt: new Date(), status: 'completed' }, { new: true });
    
    const mentor = await User.findById(sess.mentor);
    if(mentor) {
        mentor.rating = ((mentor.rating * mentor.totalReviews) + Number(rating)) / (mentor.totalReviews + 1);
        mentor.totalReviews += 1;
        await mentor.save();
    }
    io.to(sess.learner.toString()).emit('session_update');
    io.to(sess.mentor.toString()).emit('session_update');
    waitingRooms.delete(sess.roomId); 
    res.json({ message: 'Review submitted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
//           MESSAGES & WALLET
// ==========================================

// File upload for chat
app.post('/api/messages/upload', verifyToken, chatUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Generate the URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/chat/${req.file.filename}`;
    
    // Return consistent attachment object
    res.json({
      url: fileUrl,
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Read receipts – secured with verifyToken and user match
app.post('/api/messages/read/:userId/:contactId', verifyToken, async (req, res) => {
  const { userId, contactId } = req.params;
  if (userId !== req.userId.toString()) {
    return res.status(403).json({ error: "Forbidden" });
  }
  await Message.updateMany(
    {
      sender: contactId,
      receiver: userId,
      read: false
    },
    {
      $set: { read: true }
    }
  );
  res.json({ success: true });
});

app.post('/api/messages', verifyToken, async (req, res) => {
    try {
        const { sender, receiver, text, attachment } = req.body;
        
        // Create message with proper attachment object
        const msgData = {
            sender,
            receiver,
            text: text || ''
        };
        
        // Only add attachment if it exists and has required fields
        if (attachment && attachment.url) {
            msgData.attachment = {
                url: attachment.url,
                name: attachment.name || 'attachment',
                type: attachment.type || 'application/octet-stream'
            };
        }
        
        const msg = await Message.create(msgData);
        
        // Populate sender info
        const populatedMsg = await Message.findById(msg._id)
            .populate('sender', 'name avatar');
        
        console.log('📨 Emitting message with attachment to receiver:', receiver);
        
        // Get io instance
        const io = req.app.get('io');
        
        // Emit to receiver
        if (io) {
            io.to(receiver.toString()).emit('receive_chat', populatedMsg);
        }
        
        res.json(populatedMsg);
    } catch (err) {
        console.error('Message error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/messages/contacts/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;
    const sent = await Message.find({ sender: userId }).distinct('receiver');
    const received = await Message.find({ receiver: userId }).distinct('sender');
    const sessions = await Session.find({ $or: [{ learner: userId }, { mentor: userId }] });
    const sessionContacts = sessions.map(s => s.learner?.toString() === userId ? s.mentor?.toString() : s.learner?.toString()).filter(Boolean);
    const allIds = [...new Set([...sent.map(String), ...received.map(String), ...sessionContacts])];
    
    const contacts = await User.find({ _id: { $in: allIds }, role: { $ne: 'admin' }, isBanned: { $ne: true } }).select('name avatar email role');
    res.json(contacts);
});

app.get('/api/messages/:user1/:user2', verifyToken, async (req, res) => {
    try {
        const msgs = await Message.find({ 
            $or: [
                { sender: req.params.user1, receiver: req.params.user2 },
                { sender: req.params.user2, receiver: req.params.user1 }
            ] 
        })
        .sort({ createdAt: 1 })
        .populate('sender', 'name avatar')
        .populate('receiver', 'name avatar');
        
        res.json(msgs);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/wallet/history/:userId', verifyToken, async (req, res) => {
    const history = await Transaction.find({ user: req.params.userId }).sort({ date: -1 });
    res.json(history);
});

// ==========================================
//              NOTIFICATIONS
// ==========================================

app.get('/api/notifications', verifyToken, async (req, res) => {
    try {
        const notifs = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(notifs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/notifications/:id/read', verifyToken, async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, userId: req.userId });
        if (!notification) return res.status(404).json({ error: "Notification not found" });
        notification.isRead = true;
        await notification.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
//                ADMIN ROUTES
// ==========================================

app.get('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

app.put('/api/admin/ban/:userId', verifyToken, verifyAdmin, async (req, res) => {
    const user = await User.findById(req.params.userId);
    user.isBanned = !user.isBanned; 
    await user.save();
    res.json({ isBanned: user.isBanned });
});

app.get('/api/admin/stats', verifyToken, verifyAdmin, async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalSessions = await Session.countDocuments();
    const totalVolume = await Transaction.aggregate([
      { $match: { amount: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    res.json({ totalUsers, totalSessions, volume: totalVolume[0]?.total || 0 });
});

app.get('/api/admin/reviews', verifyToken, verifyAdmin, async (req, res) => {
    const reviews = await Session.find({ "review.rating": { $exists: true } })
        .populate('learner', 'name avatar').populate('mentor', 'name avatar').sort({ reviewedAt: -1 });
    res.json(reviews);
});

app.get('/api/admin/sessions', verifyToken, verifyAdmin, async (req, res) => {
    const sessions = await Session.find({}).populate('learner', 'name email').populate('mentor', 'name email').sort({ startTime: -1 });
    res.json(sessions);
});

app.get('/api/admin/settings', verifyToken, verifyAdmin, async (req, res) => {
    let s = await Settings.findOne();
    if (!s) s = await Settings.create({});
    res.json(s);
});

app.put('/api/admin/settings', verifyToken, verifyAdmin, async (req, res) => {
    const s = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(s);
});

app.get('/api/admin/analytics', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const revenueStats = await Session.aggregate([
            { $match: { status: 'completed', startTime: { $gte: sevenDaysAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } }, dailyTotal: { $sum: "$cost" } } },
            { $sort: { _id: 1 } }
        ]);

        const topSkills = await Session.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: "$skill", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const topMentors = await Session.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: "$mentor", totalEarned: { $sum: "$cost" }, sessionsCount: { $sum: 1 } } },
            { $sort: { totalEarned: -1 } },
            { $limit: 3 },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "m" } },
            { $unwind: "$m" },
            { $project: { name: "$m.name", avatar: "$m.avatar", totalEarned: 1, sessionsCount: 1 } }
        ]);

        res.json({ revenueStats, skills: topSkills.map(s => ({ name: s._id, count: s.count })), topMentors });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/communicate', verifyToken, verifyAdmin, async (req, res) => {
    const { type, target, subject, message } = req.body;
    try {
        let query = {};
        if (target === 'banned') query = { isBanned: true };
        const recipients = await User.find(query).select('_id');
        const notifs = recipients.map(u => ({ userId: u._id, type: 'system', text: `${subject}: ${message}` }));
        if (notifs.length > 0) await Notification.insertMany(notifs);
        
        io.emit('receive_notification', { type: 'system', text: `📢 ${subject}: ${message}` });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Comm failed" }); }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));