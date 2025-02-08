// Toast.js
import React from 'react';

const Toast = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
      }`}
    >
      <div className="flex justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-3 font-bold">
          X
        </button>
      </div>
    </div>
  );
};

export default Toast;
