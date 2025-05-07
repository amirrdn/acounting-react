import { useState, useEffect, useCallback } from 'react';
import { Account } from '../types/account.types';
import { accountService } from '@/api/account/account.api';


export const useAccounts = (_page: number = 1, _limit: number = 10) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async (type?: string[]) => {
    try {
      setIsLoading(true);
      const response = await accountService.getAll({ type });
      setAccounts(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAccount = useCallback(async (accountId: string) => {
    try {
      setIsLoading(true);
      const data = await accountService.getById(accountId);
      setAccount(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    account,
    isLoading,
    error,
    fetchAccounts,
    fetchAccount,
    refetch: fetchAccounts
  };
};
