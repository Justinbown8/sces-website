/**
 * Analytics Dashboard for development and testing
 */

'use client';

import { useState, useEffect } from 'react';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';

interface AnalyticsEvent {
  timestamp: number;
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export default function AnalyticsDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    // Intercept gtag calls to track events
    const originalGtag = window.gtag;
    if (originalGtag) {
      window.gtag = function(command: string, ...args: any[]) {
        if (command === 'event') {
          const [action, config] = args;
          setEvents(prev => [...prev, {
            timestamp: Date.now(),
            action,
            category: config?.event_category || 'unknown',
            label: config?.event_label,
            value: config?.value,
          }]);
        }
        return originalGtag(command, ...args);
      };
    }

    // Keyboard shortcut to toggle dashboard
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  const clearEvents = () => setEvents([]);

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
        <h3 className="font-semibold text-sm">Analytics Dashboard</h3>
        <div className="flex gap-2">
          <button
            onClick={clearEvents}
            className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-3 text-xs">
          <div className="flex justify-between">
            <span>GA4 ID:</span>
            <span className="font-mono">{GA_MEASUREMENT_ID || 'Not configured'}</span>
          </div>
          <div className="flex justify-between">
            <span>Events:</span>
            <span>{events.length}</span>
          </div>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-gray-700 text-sm">No events tracked yet</p>
          ) : (
            <div className="space-y-2">
              {events.slice(-10).reverse().map((event, index) => (
                <div key={index} className="text-xs border-b border-gray-100 pb-2">
                  <div className="font-semibold">{event.action}</div>
                  <div className="text-gray-600">
                    Category: {event.category}
                    {event.label && ` | Label: ${event.label}`}
                    {event.value && ` | Value: ${event.value}`}
                  </div>
                  <div className="text-gray-600">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-2 text-xs text-gray-600 border-t">
        Press Ctrl+Shift+A to toggle
      </div>
    </div>
  );
}