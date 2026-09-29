import { useQuery } from '@tanstack/react-query';
import { getFarmerDashboard } from '../api/farmer';

export const useFarmerDashboard = (farmerId) => {
    return useQuery({
        queryKey: ['farmerDashboard', farmerId],
        queryFn: () => getFarmerDashboard(farmerId),
        enabled: !!farmerId,
    });
};