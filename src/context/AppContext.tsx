'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

export interface ProductOption {
  size?: string;
  color?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  rating: number;
  videos?: string[];
  category?: string;
  subcategory?: string;
  subtitle?: string;
  savePercentage?: number;
  sizes?: string[];
  colors?: string[];
  itemsLeft?: number;
  commentsAndRatings?: { comment: string; rating: number }[];
  selectedOptions?: ProductOption;
}

export interface CartItem extends Product {
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
  couponCode?: string;
  discountPercentage?: number;
}

type Action =
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'ADD_TO_CART_WITH_QUANTITY'; product: Product; quantity: number }
  | { type: 'REMOVE_FROM_CART'; id: number; selectedOptions?: { size?: string; color?: string } }
  | { type: 'UPDATE_QUANTITY'; id: number; quantity: number; selectedOptions?: { size?: string; color?: string } }
  | { type: 'ADD_TO_WISHLIST'; product: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; id: number }
  | { type: 'TOGGLE_CART'; isOpen?: boolean }
  | { type: 'TOGGLE_WISHLIST'; isOpen?: boolean }
  | { type: 'OPEN_QUICK_VIEW'; product: Product }
  | { type: 'CLOSE_QUICK_VIEW' }
  | { type: 'SET_LAST_ACTION'; action: { type: string; product?: Product } }
  | { type: 'REPLACE_CART'; cartItems: CartItem[] }
  | { type: 'REPLACE_WISHLIST'; wishlistItems: Product[] }
  | { type: 'APPLY_COUPON'; couponCode: string }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR_CART' };

const initialState: State = {
  cartItems: [],
  wishlistItems: [],
  isCartOpen: false,
  isWishlistOpen: false,
  isQuickViewOpen: false,
  quickViewProduct: null,
  lastAction: undefined,
  couponCode: '',
  discountPercentage: 0,
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
      // Find an existing cart item that matches the product ID and selected options
      const existingItem = state.cartItems.find(item => 
        item.id === action.product.id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(action.product.selectedOptions)
      );
      
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.product.id && 
            JSON.stringify(item.selectedOptions) === JSON.stringify(action.product.selectedOptions)
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

    case 'ADD_TO_CART_WITH_QUANTITY': {
      // Find an existing cart item that matches the product ID and selected options
      const existingItem = state.cartItems.find(item => 
        item.id === action.product.id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(action.product.selectedOptions)
      );
      
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.product.id && 
            JSON.stringify(item.selectedOptions) === JSON.stringify(action.product.selectedOptions)
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          ),
          lastAction: { type: 'ADD_TO_CART', product: action.product },
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.product, quantity: action.quantity }],
          lastAction: { type: 'ADD_TO_CART', product: action.product },
        };
      }
    }

    case 'REMOVE_FROM_CART':
      if (action.selectedOptions) {
        // Remove specific item with matching ID and options
        return {
          ...state,
          cartItems: state.cartItems.filter(item => 
            !(item.id === action.id && JSON.stringify(item.selectedOptions) === JSON.stringify(action.selectedOptions))
          ),
        };
      } else {
        // Remove all items with the matching ID (fallback behavior)
        return {
          ...state,
          cartItems: state.cartItems.filter(item => item.id !== action.id),
        };
      }

    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        if (action.selectedOptions) {
          // Remove specific item with matching ID and options
          return {
            ...state,
            cartItems: state.cartItems.filter(item => 
              !(item.id === action.id && JSON.stringify(item.selectedOptions) === JSON.stringify(action.selectedOptions))
            ),
          };
        } else {
          // Remove all items with matching ID (fallback)
          return {
            ...state,
            cartItems: state.cartItems.filter(item => item.id !== action.id),
          };
        }
      }
      
      if (action.selectedOptions) {
        // Update quantity for specific item with matching ID and options
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.id && JSON.stringify(item.selectedOptions) === JSON.stringify(action.selectedOptions)
              ? { ...item, quantity: action.quantity }
              : item
          ),
        };
      } else {
        // Update all items with matching ID (fallback)
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.id ? { ...item, quantity: action.quantity } : item
          ),
        };
      }

    case 'ADD_TO_WISHLIST': {
      // Check if this specific combination of product and options already exists in wishlist
      const existingItem = state.wishlistItems.find(item => 
        item.id === action.product.id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(action.product.selectedOptions)
      );
      if (existingItem) {
        return state; // Item with same options already in wishlist
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

    case 'REPLACE_CART':
      return {
        ...state,
        cartItems: action.cartItems,
      };

    case 'REPLACE_WISHLIST':
      return {
        ...state,
        wishlistItems: action.wishlistItems,
      };
    
    case 'APPLY_COUPON': {
      if (action.couponCode.toUpperCase() === 'FIRST20') {
        return {
          ...state,
          couponCode: action.couponCode,
          discountPercentage: 0.2,
        };
      }
      // Optional: handle invalid coupon
      return {
        ...state,
        couponCode: '',
        discountPercentage: 0,
      };
    }
    case 'REMOVE_COUPON': {
      return {
        ...state,
        couponCode: '',
        discountPercentage: 0,
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        cartItems: [],
      };
    }

    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedCart = sessionStorage.getItem('cartItems');
    const savedWishlist = sessionStorage.getItem('wishlistItems');
    const savedCouponCode = sessionStorage.getItem('couponCode');

    if (savedCart) {
      dispatch({ type: 'REPLACE_CART', cartItems: JSON.parse(savedCart) });
    }

    if (savedWishlist) {
      dispatch({ type: 'REPLACE_WISHLIST', wishlistItems: JSON.parse(savedWishlist) });
    }

    if (savedCouponCode) {
      dispatch({ type: 'APPLY_COUPON', couponCode: savedCouponCode });
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  useEffect(() => {
    sessionStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
  }, [state.wishlistItems]);

  useEffect(() => {
    if (state.couponCode) {
      sessionStorage.setItem('couponCode', state.couponCode);
    } else {
      sessionStorage.removeItem('couponCode');
    }
  }, [state.couponCode]);

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