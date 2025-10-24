'use client';

import { useAppContext } from '@/context/AppContext';
import { FaSpinner } from 'react-icons/fa';

const LoadingIndicator = () => {
  const { state } = useAppContext();

  if (!state.isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <div className="flex items-center">
          <FaSpinner className="animate-spin text-blue-600 mr-3" size={24} />
          <span className="text-lg font-medium text-gray-700">
            {state.loadingMessage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;