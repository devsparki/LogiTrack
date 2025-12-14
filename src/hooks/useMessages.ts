import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Message } from '@/types/database';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function useMessages(receiverId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const message = payload.new as Message;
          if (message.sender_id === user.id || message.receiver_id === user.id) {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ['messages', receiverId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (receiverId) {
        query = query.or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`);
      } else {
        query = query.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user,
  });
}

export function useConversations() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(id, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Group by conversation partner
      const conversations = new Map();
      for (const msg of data) {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!conversations.has(partnerId)) {
          conversations.set(partnerId, {
            partnerId,
            partner: msg.sender_id === user.id ? msg.receiver : msg.sender,
            lastMessage: msg,
            unreadCount: 0,
          });
        }
        if (!msg.is_read && msg.receiver_id === user.id) {
          const conv = conversations.get(partnerId);
          conv.unreadCount++;
        }
      }
      
      return Array.from(conversations.values());
    },
    enabled: !!user,
  });
}

export function useSendMessage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ receiverId, content, channel }: { 
      receiverId?: string; 
      content: string; 
      channel?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          channel,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao enviar mensagem', description: error.message, variant: 'destructive' });
    },
  });
}

export function useMarkMessagesAsRead() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (senderId: string) => {
      if (!user) return;
      
      const { error } = await supabase
        .from('messages')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('sender_id', senderId)
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
