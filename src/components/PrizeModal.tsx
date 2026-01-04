import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Prize } from '@/store/leadStore';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface PrizeModalProps {
  prize: Prize | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrizeModal = ({ prize, isOpen, onClose }: PrizeModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!prize) return null;

  const promoCode = `SPIN${prize.discount.replace(/[^0-9]/g, '') || 'SHIP'}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promoCode);
      setCopied(true);
      toast({
        title: "Copied! 📋",
        description: "Your promo code has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please manually copy the code",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prize-modal-title"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Header with gradient */}
            <div 
              className="relative p-8 text-center"
              style={{ backgroundColor: prize.color }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 opacity-20"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.3)_50%,_transparent_100%)]" />
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <Sparkles className="w-16 h-16 text-primary-foreground mx-auto mb-4 drop-shadow-lg" />
              </motion.div>
              
              <motion.h2
                id="prize-modal-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-primary-foreground mb-2"
              >
                🎉 Congratulations!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-primary-foreground/90 text-lg"
              >
                You've won an amazing prize!
              </motion.p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="inline-block px-6 py-3 rounded-full bg-muted mb-4"
                >
                  <span className="text-4xl font-bold gradient-text">{prize.discount}</span>
                </motion.div>
                <p className="text-muted-foreground">
                  Use this exclusive discount on your next purchase!
                </p>
              </div>

              {/* Promo Code */}
              <div className="bg-muted rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2 text-center">Your Promo Code</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background rounded-lg px-4 py-3 font-mono font-bold text-lg text-center text-foreground border-2 border-dashed border-primary/30">
                    {promoCode}
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 shrink-0"
                    aria-label="Copy promo code"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-success" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={onClose}
                className="w-full h-12 gradient-bg text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all"
              >
                Start Shopping 🛒
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Valid for 7 days. Cannot be combined with other offers.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
