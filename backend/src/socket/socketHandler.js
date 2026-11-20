let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    // console.log(`🔌 Client connected to Socket.io: ${socket.id}`);

    // Join user-specific notification room
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });

    // Join project room for live board collaboration
    socket.on('join_project', (projectId) => {
      if (projectId) {
        socket.join(`project_${projectId}`);
      }
    });

    socket.on('leave_project', (projectId) => {
      if (projectId) {
        socket.leave(`project_${projectId}`);
      }
    });

    // Real-time task movement on Kanban board
    socket.on('task_moved', (data) => {
      if (data && data.projectId) {
        socket.to(`project_${data.projectId}`).emit('board_task_moved', data);
      }
    });

    socket.on('disconnect', () => {
      // console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => ioInstance;

const emitToProject = (projectId, event, data) => {
  if (ioInstance && projectId) {
    ioInstance.to(`project_${projectId}`).emit(event, data);
  }
};

const emitToUser = (userId, event, data) => {
  if (ioInstance && userId) {
    ioInstance.to(`user_${userId}`).emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToProject,
  emitToUser,
};
