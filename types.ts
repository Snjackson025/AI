
export enum ServiceCategory {
  CLEANING = 'Cleaning',
  SPIRITUAL = 'Spiritual',
  TECH = 'Tech & Apps',
  COMMUNITY = 'Community',
  RETAIL = 'Retail',
  OTHER = 'Other'
}

export interface Service {
  id: string;
  name: string;
  description: string;
  priceEstimate: string;
  category: ServiceCategory;
  icon: string;
}

export type AppState = 'IDLE' | 'LOADING' | 'ACTIVE' | 'ERROR' | 'SUCCESS';

export type DialerStatus = 
  | 'IDLE' 
  | 'PERMISSIONS_REQUEST' 
  | 'INITIALIZING_ENGINE' 
  | 'CONNECTING' 
  | 'DIALING' 
  | 'LIVE' 
  | 'TERMINATING' 
  | 'ERROR';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
