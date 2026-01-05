import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Lead {
  name: string;
  email?: string;
  whatsappNumber: string;
  submittedAt: Date;
}

export interface Prize {
  id: string;
  label: string;
  color: string;
  discount: string;
  isFallback?: boolean;
}

interface LeadState {
  lead: Lead | null;
  hasSpun: boolean;
  wonPrize: Prize | null;
  isSpinning: boolean;
  couponCode: string | null;
  setLead: (lead: Lead) => void;
  setHasSpun: (value: boolean) => void;
  setWonPrize: (prize: Prize | null) => void;
  setIsSpinning: (value: boolean) => void;
  setCouponCode: (code: string | null) => void;
  reset: () => void;
}

export const useLeadStore = create<LeadState>()(
  persist(
    (set) => ({
      lead: null,
      hasSpun: false,
      wonPrize: null,
      isSpinning: false,
      couponCode: null,
      setLead: (lead) => set({ lead }),
      setHasSpun: (value) => set({ hasSpun: value }),
      setWonPrize: (prize) => set({ wonPrize: prize }),
      setIsSpinning: (value) => set({ isSpinning: value }),
      setCouponCode: (code) => set({ couponCode: code }),
      reset: () => set({ lead: null, hasSpun: false, wonPrize: null, isSpinning: false, couponCode: null }),
    }),
    {
      name: 'lead-storage',
    }
  )
);

// 4-segment wheel offers with updated probability logic
export const prizes: Prize[] = [
  { id: '1', label: '30% OFF', color: '#8B5CF6', discount: '30% OFF', isFallback: true },
  { id: '2', label: '50% OFF', color: '#3B82F6', discount: '50% OFF' },
  { id: '3', label: '75% OFF', color: '#EC4899', discount: '75% OFF' },
  { id: '4', label: 'Buy @ ₹9', color: '#10B981', discount: 'Buy @ ₹9' },
];

/**
 * Selects a prize based on weighted probability logic (Day 2):
 * - 1-20 → 50% OFF (20% chance)
 * - 21-55 → 75% OFF (35% chance)
 * - 56-100 → Buy @ ₹9 (45% chance)
 * - 30% OFF is fallback only (0% normal chance)
 */
export const selectPrizeByProbability = (): Prize => {
  const random = Math.floor(Math.random() * 100) + 1; // 1-100
  
  try {
    if (random >= 1 && random <= 20) {
      // 20% chance - 50% OFF
      return prizes.find(p => p.id === '2')!;
    } else if (random >= 21 && random <= 55) {
      // 35% chance - 75% OFF
      return prizes.find(p => p.id === '3')!;
    } else {
      // 45% chance (56-100) - Buy @ ₹9
      return prizes.find(p => p.id === '4')!;
    }
  } catch {
    // Fallback to 30% OFF on any error
    return prizes.find(p => p.id === '1')!;
  }
};

/**
 * Generates a unique coupon code
 */
export const generateCouponCode = (offerId: string): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const offerPrefix = offerId === '4' ? 'DEAL9' : `OFF${offerId}0`;
  return `${offerPrefix}-${timestamp}-${random}`;
};
