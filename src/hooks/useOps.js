// src/hooks/useOps.js
import { useQuery } from '@tanstack/react-query';
import { getCrops, getDepotReport } from '../api/fra';

export const useCrops = () =>
  useQuery({
    queryKey: ['crops'],
    queryFn: getCrops,
    staleTime: 5 * 60_000,
  });

export const useDepotReport = () =>
  useQuery({
    queryKey: ['depotReport'],
    queryFn: getDepotReport,
    refetchInterval: 30_000,
  });