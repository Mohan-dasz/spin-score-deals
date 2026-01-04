import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Sparkles } from 'lucide-react';
import { SpinWheel } from '@/components/SpinWheel';
import { PrizeModal } from '@/components/PrizeModal';
import { Prize, useLeadStore } from '@/store/leadStore';
import { Button } from '@/components/ui/button';
import foxMascot from '@/assets/fox-mascot.png';
import priyamLogo from '@/assets/priyam-organics-logo.png';

const SpinWheelPage = () => {
  const navigate = useNavigate();
  const { lead, hasSpun, wonPrize, setHasSpun, setWonPrize } = useLeadStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Redirect if no lead data
    if (!lead) {
      navigate('/landing');
    }
  }, [lead, navigate]);

  useEffect(() => {
    // Show modal if already has a prize
    if (wonPrize && hasSpun) {
      setIsModalOpen(true);
    }
  }, [wonPrize, hasSpun]);

  const handleSpinComplete = (prize: Prize) => {
    setWonPrize(prize);
    setHasSpun(true);
    setTimeout(() => setIsModalOpen(true), 500);
  };

  if (!lead) return null;

  return (
    <main className="min-h-screen hero-section relative overflow-hidden">
      {/* Skip link */}
      <a 
        href="#spin-wheel" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50"
      >
        Skip to spin wheel
      </a>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 py-3 sm:py-4 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/landing')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          
          {/* Logo */}
          <img 
            src={priyamLogo} 
            alt="Priyam Organics" 
            className="h-10 sm:h-12 w-auto object-contain"
          />
          
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="hidden sm:inline">Welcome, <span className="font-medium text-foreground">{lead.name}</span>!</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div 
        id="spin-wheel"
        className="container mx-auto px-4 py-4 sm:py-6 md:py-8 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 sm:mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/20 text-primary font-medium text-xs sm:text-sm mb-3 sm:mb-4"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            Your Exclusive Spin Awaits!
          </motion.div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-2 sm:mb-4">
            Spin the Wheel,{' '}
            <span className="gradient-text">Win Big!</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
            {hasSpun 
              ? "You've already spun! Check your prize below."
              : "Click the button below to spin and reveal your exclusive discount!"
            }
          </p>
        </motion.div>

        {/* Wheel with Fox Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center items-center relative"
        >
          {/* Fox mascot - left side on desktop, top on mobile */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
            className="hidden lg:block absolute -left-8 xl:-left-16 top-1/2 -translate-y-1/2 z-20"
          >
            <motion.img
              src={foxMascot}
              alt="Fox Mascot"
              className="w-36 xl:w-44 h-auto drop-shadow-2xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 3, 0, -3, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Mobile fox mascot */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:hidden absolute -top-4 right-4 sm:right-8 z-20"
          >
            <motion.img
              src={foxMascot}
              alt="Fox Mascot"
              className="w-20 sm:w-24 h-auto drop-shadow-xl"
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <SpinWheel onSpinComplete={handleSpinComplete} />
        </motion.div>

        {/* Already spun message */}
        {hasSpun && wonPrize && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 sm:mt-8 text-center"
          >
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gradient-bg text-primary-foreground font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:opacity-90 transition-all text-sm sm:text-base"
            >
              View Your Prize: {wonPrize.discount}
            </Button>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 sm:mt-10 md:mt-12 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span>💡 Every spin wins!</span>
            <span>⏰ Limited time only</span>
            <span>🔒 Secure & instant</span>
          </div>
        </motion.div>
      </div>

      {/* Prize Modal */}
      <PrizeModal
        prize={wonPrize}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};

export default SpinWheelPage;