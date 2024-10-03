// Export a function that takes the socket.io instance as an argument
module.exports = (io) => {
  
  // Listen for new client connections
  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado'); // Log when a new client connects
  
    // Listen for 'admin_message' events from the client
    socket.on('admin_message', (msg) => {
      // Broadcast the received message to all connected clients
      io.emit('admin_broadcast', msg);
    });
  
    // Listen for the disconnect event when a client disconnects
    socket.on('disconnect', () => {
      console.log('Cliente desconectado'); // Log when a client disconnects
    });
  });
};
