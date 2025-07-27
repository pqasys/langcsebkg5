'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
// import { toast } from 'sonner';
import { 
  formatCurrency, 
  getCurrencySymbol, 
  formatCurrencyWithSymbol, 
  getCurrencyInfo, 
  isValidCurrencyCode 
} from '@/app/lib/utils';

export function useCurrency() {
  const { data: session } = useSession();
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [currencyInfo, setCurrencyInfo] = useState(getCurrencyInfo('USD'));

  useEffect(() => {
    const fetchCurrencySettings = async () => {
      try {
        // For admin users, we'll use USD as default
        if (session?.user?.role === 'ADMIN') {
          setCurrencyCode('USD');
          setCurrencyInfo(getCurrencyInfo('USD'));
          return;
        }

        // For institution users, fetch their settings
        if (session?.user?.role === 'INSTITUTION') {
          const response = await fetch('/api/institution/settings');
          if (!response.ok) {
            throw new Error(`Failed to fetch currency settings - Context: throw new Error('Failed to fetch currency settings...`);
          }
          const data = await response.json();
          
          if (data.currency && isValidCurrencyCode(data.currency)) {
            setCurrencyCode(data.currency);
            setCurrencyInfo(getCurrencyInfo(data.currency));
          } else {
            // // // console.warn('Invalid currency code received:', data.currency);
            setCurrencyCode('USD');
            setCurrencyInfo(getCurrencyInfo('USD'));
          }
        }
      } catch (error) {
        console.error('Error fetching currency settings:', error);
        // Fallback to USD on error
        setCurrencyCode('USD');
        setCurrencyInfo(getCurrencyInfo('USD'));
      }
    };

    if (session?.user) {
      fetchCurrencySettings();
    }
  }, [session]);

  return {
    currencyCode,
    currencyInfo,
    formatCurrency: (amount: number) => formatCurrency(amount, currencyCode),
    getCurrencySymbol: () => getCurrencySymbol(currencyCode),
    formatCurrencyWithSymbol: (amount: number) => formatCurrencyWithSymbol(amount, currencyCode)
  };
} 