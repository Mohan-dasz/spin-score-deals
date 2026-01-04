import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, User, ArrowRight, Gift } from 'lucide-react';
import { useLeadStore } from '@/store/leadStore';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

const leadSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  whatsappNumber: z.string()
    .trim()
    .min(10, 'Please enter a valid WhatsApp number')
    .max(15, 'WhatsApp number is too long')
    .regex(/^[0-9+\-\s]+$/, 'Please enter a valid phone number'),
});

type LeadFormData = z.infer<typeof leadSchema>;

export const LeadForm = () => {
  const navigate = useNavigate();
  const { setLead, reset } = useLeadStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      whatsappNumber: '',
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    
    try {
      // Normalize WhatsApp number (remove spaces and dashes)
      const normalizedNumber = data.whatsappNumber.replace(/[\s\-]/g, '');
      
      // Check if this WhatsApp number has already spun
      const { data: existingLead, error: checkError } = await supabase
        .from('leads')
        .select('id, offer_label')
        .eq('whatsapp_number', normalizedNumber)
        .maybeSingle();

      if (checkError) {
        throw new Error('Failed to verify your number. Please try again.');
      }

      if (existingLead) {
        toast({
          title: "Already Participated! 🎯",
          description: `This WhatsApp number has already won: ${existingLead.offer_label}`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Reset any previous state
      reset();
      
      // Set new lead data
      setLead({
        name: data.name,
        whatsappNumber: normalizedNumber,
        submittedAt: new Date(),
      });
      
      toast({
        title: "You're in! 🎉",
        description: "Get ready to spin the wheel and win amazing offers!",
      });
      
      navigate('/spin-wheel');
    } catch (error) {
      toast({
        title: "Oops!",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Unlock Your Offer</h2>
          <p className="text-muted-foreground">Enter your details to spin the wheel and win exclusive deals!</p>
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
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">WhatsApp Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-10 h-12 bg-background border-input focus:border-primary focus:ring-primary"
                        aria-describedby="whatsapp-error"
                      />
                    </div>
                  </FormControl>
                  <FormMessage id="whatsapp-error" />
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
                  Verifying...
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
          One spin per WhatsApp number. By participating, you agree to our terms.
        </p>
      </div>
    </motion.div>
  );
};
