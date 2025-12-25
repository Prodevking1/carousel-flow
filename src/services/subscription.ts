import { supabase } from '../lib/supabase';

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'inactive';
  subscription_type?: 'lifetime';
  amount_paid?: number;
  stripe_customer_id?: string;
  stripe_payment_intent_id?: string;
  created_at: string;
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
