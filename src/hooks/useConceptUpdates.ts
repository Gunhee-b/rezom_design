import { useEffect, useRef, useState, useCallback } from 'react';

export interface ConceptUpdateEvent {
  type: 'concept-update' | 'connected';
  conceptSlug?: string;
  timestamp?: number;
  data?: {
    action?: string;
    questionId?: number;
    questionTitle?: string;
  };
}

interface UseConceptUpdatesOptions {
  enabled?: boolean;
  onUpdate?: (event: ConceptUpdateEvent) => void;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useConceptUpdates(
  conceptSlug: string,
  options: UseConceptUpdatesOptions = {}
) {
  const {
    enabled = true,
    onUpdate,
    onError,
    onConnect,
    onDisconnect
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<ConceptUpdateEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!enabled || !conceptSlug || eventSourceRef.current) {
      return;
    }

    try {
      // Construct the SSE URL
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const url = `${baseUrl}/define/concepts/${conceptSlug}/updates`;
      
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
        onConnect?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const data: ConceptUpdateEvent = JSON.parse(event.data);
          setLastEvent(data);
          
          // Only call onUpdate for actual updates, not connection messages
          if (data.type === 'concept-update') {
            onUpdate?.(data);
          }
        } catch (err) {
          console.warn('Failed to parse SSE data:', event.data);
        }
      };

      eventSource.onerror = (event) => {
        setIsConnected(false);
        setError('Connection error occurred');
        onError?.(event);
        
        // Cleanup on error
        eventSource.close();
        eventSourceRef.current = null;
        
        // Prevent immediate reconnection loop
        setTimeout(() => {
          // Only reconnect if still enabled and no connection exists
          if (enabled && conceptSlug && !eventSourceRef.current) {
            connect();
          }
        }, 5000); // Wait 5 seconds before attempting reconnect
      };

    } catch (err) {
      setError('Failed to establish SSE connection');
      console.error('SSE connection error:', err);
    }
  }, [enabled, conceptSlug, onUpdate, onError, onConnect]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      onDisconnect?.();
    }
  }, [onDisconnect]);

  // Effect to manage connection
  useEffect(() => {
    if (enabled && conceptSlug) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      disconnect();
    };
  }, [enabled, conceptSlug, connect, disconnect]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    lastEvent,
    error,
    connect,
    disconnect,
  };
}