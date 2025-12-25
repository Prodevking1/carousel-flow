import { supabase } from '../lib/supabase';

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'inactive';
  subscription_type?: 'lifetime_early' | 'lifetime' | 'monthly';
  amount_paid?: number;
  stripe_customer_id?: string;
  stripe_payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionConfig {
  id: string;
  early_bird_limit: number;
  early_bird_count: number;
  early_bird_price: number;
  lifetime_price: number;
  monthly_price: number;
  updated_at: string;
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return subscription?.status === 'active';
}

export async function getSubscriptionConfig(): Promise<SubscriptionConfig | null> {
  const { data, error } = await supabase
    .from('subscription_config')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching config:', error);
    return null;
  }

  return data;
}

export function getCurrentPrice(config: SubscriptionConfig): { amount: number; type: 'lifetime_early' | 'lifetime' } {
  if (config.early_bird_count < config.early_bird_limit) {
    return {
      amount: config.early_bird_price,
      type: 'lifetime_early'
    };
  }
  return {
    amount: config.lifetime_price,
    type: 'lifetime'
  };
}

export function getSpotsRemaining(config: SubscriptionConfig): number {
  return Math.max(0, config.early_bird_limit - config.early_bird_count);
}
