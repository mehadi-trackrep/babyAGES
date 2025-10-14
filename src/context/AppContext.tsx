'use client';

import { createContext, useContext, useReducer } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];  // Updated to match the new product structure
  rating?: number;
  videos?: string[];
}

interface CartItem extends Product {
  quantity: number;
}

interface State {
  cartItems: CartItem[];
  wishlistItems: Product[];
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  lastAction?: { type: string; product?: Product };
}

type Action =
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; id: number }
  | { type: 'UPDATE_QUANTITY'; id: number; quantity: number }
  | { type: 'ADD_TO_WISHLIST'; product: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; id: number }
  | { type: 'TOGGLE_CART'; isOpen?: boolean }
  | { type: 'TOGGLE_WISHLIST'; isOpen?: boolean }
  | { type: 'OPEN_QUICK_VIEW'; product: Product }
  | { type: 'CLOSE_QUICK_VIEW' }
  | { type: 'SET_LAST_ACTION'; action: { type: string; product?: Product } };

const initialState: State = {
  cartItems: [],
  wishlistItems: [],
  isCartOpen: false,
  isWishlistOpen: false,
  isQuickViewOpen: false,
  quickViewProduct: null,
  lastAction: undefined,
};

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const appReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cartItems.find(item => item.id === action.product.id);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          lastAction: { type: 'ADD_TO_CART', product: action.product },
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.product, quantity: 1 }],
          lastAction: { type: 'ADD_TO_CART', product: action.product },
        };
      }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.id),
      };

    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return {
          ...state,
          cartItems: state.cartItems.filter(item => item.id !== action.id),
        };
      }
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item
        ),
      };

    case 'ADD_TO_WISHLIST': {
      const existingItem = state.wishlistItems.find(item => item.id === action.product.id);
      if (existingItem) {
        return state; // Item already in wishlist
      }
      return {
        ...state,
        wishlistItems: [...state.wishlistItems, action.product],
        lastAction: { type: 'ADD_TO_WISHLIST', product: action.product },
      };
    }

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(item => item.id !== action.id),
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isCartOpen: action.isOpen !== undefined ? action.isOpen : !state.isCartOpen,
      };

    case 'TOGGLE_WISHLIST':
      return {
        ...state,
        isWishlistOpen: action.isOpen !== undefined ? action.isOpen : !state.isWishlistOpen,
      };

    case 'OPEN_QUICK_VIEW':
      return {
        ...state,
        isQuickViewOpen: true,
        quickViewProduct: action.product,
      };

    case 'CLOSE_QUICK_VIEW':
      return {
        ...state,
        isQuickViewOpen: false,
        quickViewProduct: null,
      };

    case 'SET_LAST_ACTION':
      return {
        ...state,
        lastAction: action.action,
      };

    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};