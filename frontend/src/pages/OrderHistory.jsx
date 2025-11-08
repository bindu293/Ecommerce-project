import React from 'react';
import OrderTracking from '../components/OrderTracking';

const OrderHistory = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>
      <OrderTracking />
    </div>
  );
};

export default OrderHistory;