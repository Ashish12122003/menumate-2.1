// src/hooks/useVendorWebSocket.js

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { newOrderReceived, updateOrderStatus } from '../features/vendor/orderSlice'; // We will create this slice next

const WEBSOCKET_URL = import.meta.env.VITE_REACT_APP_WEBSOCKET_URL || 'http://localhost:3000';

const useVendorWebSocket = (shopId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!shopId) return;

    const socket = io(WEBSOCKET_URL);

    socket.on('connect', () => {
      console.log('Vendor connected to WebSocket server:', socket.id);
      socket.emit('joinShopRoom', shopId);
    });

    socket.on('new_order', (payload) => {
      console.log('New order received:', payload);
      dispatch(newOrderReceived(payload));
    });

    // Listen for customer waiter calls
    socket.on('waiter_call_alert', (payload) => {
      console.log('Waiter call alert:', payload);
      // You can dispatch a separate action here to show a notification
    });

    // Listen for status updates on orders the vendor might be viewing
    socket.on('order_status_update', (payload) => {
      console.log('Order status updated from server:', payload);
      dispatch(updateOrderStatus(payload));
    });

    socket.on('disconnect', () => {
      console.log('Vendor disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, [shopId, dispatch]);
};

export default useVendorWebSocket;