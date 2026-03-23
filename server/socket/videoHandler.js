/**
 * SkillSphere Video Signaling Handler
 * Handles P2P Handshakes & "Partner Waiting" signals
 */

const videoHandler = (io, socket) => {
  
  // --- 1. LOBBY SIGNALING ---
  // Triggered when a user opens the VideoRoom page (even before joining)
  socket.on('user_entered_room', ({ roomId, userId }) => {
    socket.join(roomId);
    
    // Broadcast to the OTHER person in this room that you are ready
    // This triggers the 'partner_active' pulse on their Dashboard
    socket.to(roomId).emit('partner_active', { roomId, userId });
    
    console.log(`[Lobby] User ${userId} is waiting in room: ${roomId}`);
  });

  // --- 2. JOINING THE ACTIVE CALL ---
  // Triggered when the user clicks "Join Session"
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    
    // Check how many people are in the room
    const clients = io.sockets.adapter.rooms.get(roomId);
    const numClients = clients ? clients.size : 0;

    // If you are the second person joining, tell the first person to start the call
    if (numClients > 1) {
      // Send to everyone else in the room (the initiator)
      socket.to(roomId).emit('user_joined', socket.id);
    }
  });

  // --- 3. WebRTC SIGNAL RELAY ---
  // Simple-Peer uses these to exchange SDP (Offers/Answers)
  socket.on('callUser', ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit('callUser', {
      signal: signalData,
      from,
      name
    });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  // --- 4. DISCONNECTION & CLEANUP ---
  socket.on('end_call', ({ roomId }) => {
    // Notify the partner to close their camera/stop tracks
    socket.to(roomId).emit('callEnded');
    
    // Remove the "Partner Waiting" badge from their dashboard
    socket.to(roomId).emit('partner_inactive', { roomId });
    
    socket.leave(roomId);
    console.log(`[Call] Session ended in room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    // Note: In a production app, you would track which room this socket was in 
    // to emit 'partner_inactive' automatically on drop.
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
};

export default videoHandler;