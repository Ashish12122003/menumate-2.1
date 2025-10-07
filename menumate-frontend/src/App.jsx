// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './store.js';
import AppRoutes from './routes/AppRoutes.jsx';
import { fetchVendorProfile } from './features/vendor/vendorAuthSlice';

const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('vendorToken');
    if (token) {
      // Hydrate vendor data on refresh
      dispatch(fetchVendorProfile());
    }
  }, [dispatch]);

  return <AppRoutes />;
};

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
