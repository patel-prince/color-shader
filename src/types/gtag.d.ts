// Google Analytics gtag types
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: string | number | boolean;
      }
    ) => void;
  }
}

export {};
