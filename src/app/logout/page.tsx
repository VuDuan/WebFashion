"use client";
import React from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Xác nhận đăng xuất</h2>
        <p>Bạn có chắc chắn muốn đăng xuất không?</p>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">
            Hủy
          </button>
          <button onClick={onLogout} className="px-4 py-2 bg-red-500 text-white rounded">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;