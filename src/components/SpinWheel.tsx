import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { prizes, Prize, useLeadStore } from '@/store/leadStore';
import confetti from 'canvas-confetti';

interface SpinWheelProps {
  onSpinComplete: (prize: Prize) => void;
}

export const SpinWheel = ({ onSpinComplete }: SpinWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { isSpinning, setIsSpinning, hasSpun } = useLeadStore();

  const segmentAngle = 360 / prizes.length;

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    prizes.forEach((prize, index) => {
      const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = prize.color;
      ctx.fill();

      // Add segment border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + (segmentAngle / 2) * (Math.PI / 180));
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Poppins, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.fillText(prize.label, radius - 20, 5);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
    gradient.addColorStop(0, '#3B82F6');
    gradient.addColorStop(1, '#8B5CF6');
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [segmentAngle]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const selectPrize = (): Prize => {
    const random = Math.random();
    let cumulative = 0;
    
    for (const prize of prizes) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize;
      }
    }
    return prizes[prizes.length - 1];
  };

  const spin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    const selectedPrize = selectPrize();
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    
    // Calculate rotation to land on the prize
    const baseRotations = 5; // Number of full rotations
    const prizeAngle = prizeIndex * segmentAngle + segmentAngle / 2;
    const finalRotation = baseRotations * 360 + (360 - prizeAngle);

    if (wheelRef.current) {
      wheelRef.current.style.setProperty('--spin-degrees', `${finalRotation}deg`);
    }

    // Wait for animation to complete
    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(selectedPrize);

      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
      });
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Pointer */}
      <div className="relative z-10 -mb-4">
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-primary drop-shadow-lg" />
      </div>

      {/* Wheel Container */}
      <div className="relative">
        <motion.div
          ref={wheelRef}
          className={`relative ${isSpinning ? 'animate-spin-wheel' : ''}`}
          initial={{ rotate: 0 }}
        >
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            className="drop-shadow-2xl"
          />
        </motion.div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl -z-10" />
      </div>

      {/* Spin Button */}
      <motion.button
        onClick={spin}
        disabled={isSpinning || hasSpun}
        className="gradient-bg text-primary-foreground px-10 py-4 rounded-full font-bold text-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 glow-effect"
        whileHover={{ scale: isSpinning || hasSpun ? 1 : 1.05 }}
        whileTap={{ scale: isSpinning || hasSpun ? 1 : 0.95 }}
        aria-label="Spin the wheel"
      >
        {isSpinning ? 'Spinning...' : hasSpun ? 'Already Spun!' : '🎰 SPIN TO WIN!'}
      </motion.button>
    </div>
  );
};
