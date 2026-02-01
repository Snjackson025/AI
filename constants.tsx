
import { Service, ServiceCategory } from './types';

export const SERVICES: Service[] = [
  {
    id: 'clean-1',
    name: 'Home & Office Cleaning',
    description: 'Professional sanitization and deep cleaning for residential and commercial spaces.',
    priceEstimate: '$150 - $500',
    category: ServiceCategory.CLEANING,
    icon: 'fa-broom'
  },
  {
    id: 'spirit-1',
    name: 'Spiritual Cleansing',
    description: 'Energetic purification of spaces and individuals. Removal of negative attachments.',
    priceEstimate: '$200 - $1,000',
    category: ServiceCategory.SPIRITUAL,
    icon: 'fa-ghost'
  },
  {
    id: 'spirit-2',
    name: 'Professional Exorcism',
    description: 'Specialized ritualistic removal of malevolent entities. Safe and confidential.',
    priceEstimate: 'Quote Required',
    category: ServiceCategory.SPIRITUAL,
    icon: 'fa-cross'
  },
  {
    id: 'tech-1',
    name: 'Custom Web Applications',
    description: 'Scalable React-based web solutions with modern architecture and AI integration.',
    priceEstimate: '$2,500+',
    category: ServiceCategory.TECH,
    icon: 'fa-code'
  },
  {
    id: 'comm-1',
    name: 'Community Development',
    description: 'Strategic planning and outreach programs for local community growth.',
    priceEstimate: 'Varies',
    category: ServiceCategory.COMMUNITY,
    icon: 'fa-users'
  },
  {
    id: 'retail-1',
    name: 'Custom T-Shirt Printing',
    description: 'Bulk community or niche-specific merchandise design and printing.',
    priceEstimate: '$15/shirt+',
    category: ServiceCategory.RETAIL,
    icon: 'fa-shirt'
  }
];
