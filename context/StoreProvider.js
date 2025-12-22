import React, { createContext, useContext, useEffect } from 'react';
import useSurveyStore from '../store/surveyStore';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const store = useSurveyStore();
  
  // Initialize store on mount
  useEffect(() => {
    store.initializeFromStorage();
  }, []);
  
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook for easy access
export const useSurvey = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useSurvey must be used within StoreProvider');
  }
  return context;
};