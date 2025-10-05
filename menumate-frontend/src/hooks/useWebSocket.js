// src/hooks/useWebSocket.js

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { updateOrderStatus } from '../features/order/orderSlice';

const WEBSOCKET_URL = import.meta.env.VITE_REACT_APP_WEBSOCKET_URL || 'http://localhost:3000';

const useWebSocket = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return; // Only connect if a user is logged in

    const socket = io(WEBSOCKET_URL);

    // Join the user-specific room to receive updates
    socket.on('connect', () => {
      console.log('Connected to WebSocket server:', socket.id);
      socket.emit('joinUserRoom', user._id); // Assuming the user object has an _id field
    });

    // Listen for order status updates from the server
    socket.on('order_status_update', (payload) => {
      console.log('Order status updated:', payload);
      dispatch(updateOrderStatus(payload));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [user, dispatch]);
};

export default useWebSocket;