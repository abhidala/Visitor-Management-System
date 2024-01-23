import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextProps {
  children: ReactNode;
}

interface DataContextValue {
  sharedData: string;
  updateSharedData: (newData: string) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<DataContextProps> = ({ children }) => {
  const [sharedData, setSharedData] = useState<string>('ABCD');

  const updateSharedData = (newData: string) => {
    setSharedData(newData);
  };

  return (
    <DataContext.Provider value={{ sharedData, updateSharedData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextValue => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
