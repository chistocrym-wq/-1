/// <reference types="vite/client" />

interface TelegramBackButton {
  show(): TelegramBackButton;
  hide(): TelegramBackButton;
  onClick(callback: () => void): TelegramBackButton;
  offClick(callback: () => void): TelegramBackButton;
}

interface TelegramWebApp {
  ready(): void;
  expand(): void;
  BackButton: TelegramBackButton;
  HapticFeedback?: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
  };
}

interface Window {
  Telegram?: { WebApp: TelegramWebApp };
}
