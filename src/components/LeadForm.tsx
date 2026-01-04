import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User, ArrowRight, Gift } from 'lucide-react';
import { useLeadStore } from '@/store/leadStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

const leadSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
});

type LeadFormData = z.infer<typeof leadSchema>;

export const LeadForm = () => {
  const navigate = useNavigate();
  const { setLead } = useLeadStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setLead({
      name: data.name,
      email: data.email,
      submittedAt: new Date(),
    });
    
    toast({
      title: "You're in! 🎉",
      description: "Get ready to spin the wheel and win amazing discounts!",
    });
    
    setIsSubmitting(false);
    navigate('/spin-wheel');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="card-elevated p-8 backdrop-blur-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-bg mb-4 glow-effect">
            <Gift className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Unlock Your Discount</h2>
          <p className="text-muted-foreground">Enter your details to spin the wheel and win exclusive offers!</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Your Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="John Doe"
                        className="pl-10 h-12 bg-background border-input focus:border-primary focus:ring-primary"
                        aria-describedby="name-error"
                      />
                    </div>
                  </FormControl>
                  <FormMessage id="name-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10 h-12 bg-background border-input focus:border-primary focus:ring-primary"
                        aria-describedby="email-error"
                      />
                    </div>
                  </FormControl>
                  <FormMessage id="email-error" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 gradient-bg text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all glow-effect"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Spin the Wheel
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>
        </Form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          By submitting, you agree to receive promotional emails. Unsubscribe anytime.
        </p>
      </div>
    </motion.div>
  );
};
