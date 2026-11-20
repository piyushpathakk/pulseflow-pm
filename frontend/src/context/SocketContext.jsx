import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Only connect if user is authenticated or on app pages
    const socketInstance = io(window.location.origin, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      if (user?.id) {
        socketInstance.emit('join_user', user.id);
      }
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    // Global incoming notifications
    socketInstance.on('new_notification', (data) => {
      showToast(data.message || data.title, 'info');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id]);

  const joinProject = (projectId) => {
    if (socket && projectId) {
      socket.emit('join_project', projectId);
    }
  };

  const leaveProject = (projectId) => {
    if (socket && projectId) {
      socket.emit('leave_project', projectId);
    }
  };

  const emitTaskMoved = (data) => {
    if (socket && data) {
      socket.emit('task_moved', data);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        joinProject,
        leaveProject,
        emitTaskMoved,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context || {};
};
