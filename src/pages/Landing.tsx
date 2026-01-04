import { motion } from 'framer-motion';
import { Sparkles, Gift, Percent, Zap, ShoppingBag } from 'lucide-react';
import { LeadForm } from '@/components/LeadForm';

const floatingIcons = [
  { icon: Gift, delay: 0, x: '10%', y: '20%' },
  { icon: Percent, delay: 0.5, x: '85%', y: '15%' },
  { icon: Sparkles, delay: 1, x: '15%', y: '70%' },
  { icon: Zap, delay: 1.5, x: '80%', y: '65%' },
  { icon: ShoppingBag, delay: 2, x: '50%', y: '85%' },
];

const Landing = () => {
  return (
    <main className="min-h-screen hero-section relative overflow-hidden">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        
        {/* Floating icons */}
        {floatingIcons.map(({ icon: Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 0.3, 
              y: [0, -15, 0],
            }}
            transition={{
              opacity: { delay, duration: 0.5 },
              y: { delay, duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Icon className="w-8 h-8 text-primary/40" />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div 
        id="main-content"
        className="container mx-auto px-4 py-12 md:py-20 relative z-10"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Hero Text */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Limited Time Offer
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Spin & Win{' '}
              <span className="gradient-text">Exclusive</span>{' '}
              Discounts!
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Enter your email for a chance to spin our prize wheel and unlock amazing deals up to <span className="font-bold text-primary">50% OFF</span> on your next purchase!
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {[
                { icon: Gift, text: 'Guaranteed Prizes' },
                { icon: Zap, text: 'Instant Delivery' },
                { icon: ShoppingBag, text: 'Shop Now' },
              ].map(({ icon: Icon, text }, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card shadow-sm"
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Lead Form */}
          <motion.div
            className="flex-1 w-full max-w-md"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LeadForm />
          </motion.div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">Trusted by thousands of happy customers</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {['10K+ Spins', '5K+ Winners', '100% Secure', 'Instant Codes'].map((badge) => (
              <div key={badge} className="text-sm font-medium text-muted-foreground">
                {badge}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SpinToWin. All rights reserved.
      </footer>
    </main>
  );
};

export default Landing;
