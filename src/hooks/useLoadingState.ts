import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export const useClearLoadingOnMount = () => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    // Clear loading state when component mounts
    dispatch({ type: 'SET_LOADING', isLoading: false, message: '' });
  }, [dispatch]);
};