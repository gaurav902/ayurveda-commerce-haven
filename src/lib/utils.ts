
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in paise to INR currency string
export function formatCurrency(amount: number): string {
  const inRupees = amount / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inRupees);
}

// Generate random receipt/order number
export function generateOrderNumber(): string {
  const prefix = 'AYU';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

// Generate thank you messages
export const getThankYouMessage = (): string => {
  const messages = [
    "Thank you for choosing Ayurveda. Your wellness journey begins now.",
    "We appreciate your order. May Ayurveda bring balance to your life.",
    "Thank you for supporting authentic Ayurvedic traditions.",
    "We're grateful for your purchase. Here's to your natural wellness path.",
    "Thank you! Your journey to wellness through Ayurveda starts today."
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

// Format date to readable format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
