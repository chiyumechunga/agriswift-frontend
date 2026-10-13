// src/hooks/useFarmerPortal.js
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addPaymentAccount,
  getDeliveryHistory,
  getDeliveryReceipt,
  getPaymentAccounts,
  getPaymentProgress,
  initiateSimulatedPayment,
  selectPreferredAccount,
} from '../api/farmer.js';

const terminalPaymentStates = new Set([
  'SUCCEEDED',
  'FAILED',
  'ACKNOWLEDGED',
]);

export const usePaymentAccounts = () =>
  useQuery({
    queryKey: ['farmer', 'paymentAccounts'],
    queryFn: getPaymentAccounts,
    staleTime: 30_000,
  });

export const useDeliveryHistory = ({ page = 0, size = 20 } = {}) =>
  useQuery({
    queryKey: ['farmer', 'deliveries', page, size],
    queryFn: () => getDeliveryHistory({ page, size }),
    staleTime: 15_000,
  });

export const useDeliveryReceipt = (receiptId) =>
  useQuery({
    queryKey: ['farmer', 'receipt', receiptId],
    queryFn: () => getDeliveryReceipt(receiptId),
    enabled: Boolean(receiptId),
  });

export const useAddPaymentAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPaymentAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['farmer', 'paymentAccounts'],
      });
    },
  });
};

export const useSelectPreferredAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: selectPreferredAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['farmer', 'paymentAccounts'],
      });
    },
  });
};

export const useInitiateSimulatedPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiateSimulatedPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['farmer', 'deliveries'],
      });
    },
  });
};

export const usePaymentProgress = (paymentId) =>
  useQuery({
    queryKey: ['farmer', 'payment', paymentId],
    queryFn: () => getPaymentProgress(paymentId),
    enabled: Boolean(paymentId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && terminalPaymentStates.has(status) ? false : 800;
    },
  });

export function useInvalidateFarmerDataOnPaymentCompletion(payment) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (payment?.status && terminalPaymentStates.has(payment.status)) {
      queryClient.invalidateQueries({
        queryKey: ['farmer', 'deliveries'],
      });
      queryClient.invalidateQueries({
        queryKey: ['farmer', 'paymentAccounts'],
      });
    }
  }, [payment?.status, queryClient]);
}