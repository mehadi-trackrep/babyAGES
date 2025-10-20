'use client';

import { useEffect, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'react-toastify';

const ToastManager = () => {
  const { state } = useAppContext();
  const lastActionRef = useRef(state.lastAction);

  useEffect(() => {
    // Only show toast if the action has changed
    if (state.lastAction && state.lastAction !== lastActionRef.current) {
      lastActionRef.current = state.lastAction;
      
      if (state.lastAction.product) {
        switch (state.lastAction.type) {
          case 'ADD_TO_CART':
          case 'ADD_TO_CART_WITH_QUANTITY':
            toast.success(`${state.lastAction.product.name} added to cart!`, {
              position: "bottom-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            break;
          case 'ADD_TO_WISHLIST':
            toast.info(`${state.lastAction.product.name} added to wishlist!`, {
              position: "bottom-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            break;
        }
      }
    }
  }, [state.lastAction]);

  return null;
};

export default ToastManager;