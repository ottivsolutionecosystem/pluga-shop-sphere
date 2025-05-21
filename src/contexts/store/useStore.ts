
import { useContext } from 'react';
import { StoreContext } from './StoreProvider';

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
