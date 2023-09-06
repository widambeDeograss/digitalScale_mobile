import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BleDevice {
  name: string | null;
  id: string | null;
}

interface currentFarmerI {
  name: string | null;
  id: string | null;
  crop: string | null;
  cropId:string | null;
  corporate: string | null;
}

interface ReceiptI {
  receiptId: string | null;
  crop: string | null;
  cropId: string | null;
  corporate: string | null;
  farmer: string | null,
  saledate: string | null,
  quantity_before: string | null,
  moisturePercentage: string | null,
  quantityInKg: string | null,
  totalPay: string | null
}


interface BleContextType {
  connectedScale: BleDevice | null;
  currentFarmer: currentFarmerI | null;
  currentReceipt: ReceiptI | null;
  setConnectedScale: (device: BleDevice | null) => void;
  setCurrentFarmer: (farmer: currentFarmerI | null) => void;
  setCurrentReceipt: (receipt: ReceiptI | null) => void;
}

const BleContext = createContext<BleContextType | undefined>(undefined);

export const useBleContext = (): BleContextType => {
  const context = useContext(BleContext);
  if (context === undefined) {
    throw new Error('useBleContext must be used within a BleProvider');
  }
  return context;
};

interface BleProviderProps {
  children: ReactNode;
}

export const BleProvider: React.FC<BleProviderProps> = ({ children }) => {
  const [connectedScale, setConnectedScale] = useState<BleDevice | null>(null);
  const [currentFarmer, setCurrentFarmer] = useState<currentFarmerI | null>(null);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptI | null>(null)

  return (
    <BleContext.Provider value={{ connectedScale, setConnectedScale, currentFarmer, setCurrentFarmer, currentReceipt, setCurrentReceipt }}>
      {children}
    </BleContext.Provider>
  );
};
