import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Lead {
  email: string;
  name: string;
  submittedAt: Date;
}

export interface Prize {
  id: string;
  label: string;
  color: string;
  discount: string;
  probability: number;
}

interface LeadState {
  lead: Lead | null;
  hasSpun: boolean;
  wonPrize: Prize | null;
  isSpinning: boolean;
  setLead: (lead: Lead) => void;
  setHasSpun: (value: boolean) => void;
  setWonPrize: (prize: Prize | null) => void;
  setIsSpinning: (value: boolean) => void;
  reset: () => void;
}

export const useLeadStore = create<LeadState>()(
  persist(
    (set) => ({
      lead: null,
      hasSpun: false,
      wonPrize: null,
      isSpinning: false,
      setLead: (lead) => set({ lead }),
      setHasSpun: (value) => set({ hasSpun: value }),
      setWonPrize: (prize) => set({ wonPrize: prize }),
      setIsSpinning: (value) => set({ isSpinning: value }),
      reset: () => set({ lead: null, hasSpun: false, wonPrize: null, isSpinning: false }),
    }),
    {
      name: 'lead-storage',
    }
  )
);

export const prizes: Prize[] = [
  { id: '1', label: '50% OFF', color: '#3B82F6', discount: '50%', probability: 0.05 },
  { id: '2', label: '30% OFF', color: '#8B5CF6', discount: '30%', probability: 0.10 },
  { id: '3', label: '20% OFF', color: '#EC4899', discount: '20%', probability: 0.15 },
  { id: '4', label: '15% OFF', color: '#F59E0B', discount: '15%', probability: 0.20 },
  { id: '5', label: '10% OFF', color: '#10B981', discount: '10%', probability: 0.25 },
  { id: '6', label: 'Free Ship', color: '#EF4444', discount: 'Free Shipping', probability: 0.25 },
];
