'use client';

import { useState } from 'react';
import { toast } from 'sonner';

const useFetch = <T>(cb: (...args: any[]) => T | Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean | null>(false);

  const fn = async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response as T);
      setError(null);
    } catch (e) {
      setError(typeof e === 'boolean' ? e : true);
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fn,
    setData,
  };
};

export default useFetch;