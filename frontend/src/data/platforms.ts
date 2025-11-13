/**
 * Popular subscription platforms data
 */
import { BillingCycle } from '../types/subscription'

export interface Platform {
  id: string
  name: string
  category: string
  icon: string // Emoji or icon identifier
  color: string // Brand color
  suggestedPrice?: number
  suggestedCycle?: BillingCycle
}

export const POPULAR_PLATFORMS: Platform[] = [
  // Streaming Services
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Entertainment',
    icon: '🎬',
    color: '#E50914',
    suggestedPrice: 15.49,
    suggestedCycle: 'monthly',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Entertainment',
    icon: '🎵',
    color: '#1DB954',
    suggestedPrice: 10.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    category: 'Entertainment',
    icon: '📺',
    color: '#FF0000',
    suggestedPrice: 11.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    category: 'Entertainment',
    icon: '🏰',
    color: '#113CCF',
    suggestedPrice: 7.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'hbo-max',
    name: 'HBO Max',
    category: 'Entertainment',
    icon: '🎭',
    color: '#7B3FF2',
    suggestedPrice: 15.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'apple-tv',
    name: 'Apple TV+',
    category: 'Entertainment',
    icon: '🍎',
    color: '#000000',
    suggestedPrice: 6.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'amazon-prime',
    name: 'Amazon Prime',
    category: 'Entertainment',
    icon: '📦',
    color: '#FF9900',
    suggestedPrice: 14.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'hulu',
    name: 'Hulu',
    category: 'Entertainment',
    icon: '🟢',
    color: '#1CE783',
    suggestedPrice: 7.99,
    suggestedCycle: 'monthly',
  },

  // Productivity & Software
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    category: 'Productivity',
    icon: '💼',
    color: '#D83B01',
    suggestedPrice: 9.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'google-one',
    name: 'Google One',
    category: 'Productivity',
    icon: '☁️',
    color: '#4285F4',
    suggestedPrice: 1.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'Productivity',
    icon: '📂',
    color: '#0061FF',
    suggestedPrice: 11.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    category: 'Productivity',
    icon: '🎨',
    color: '#FF0000',
    suggestedPrice: 54.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Productivity',
    icon: '📝',
    color: '#000000',
    suggestedPrice: 8,
    suggestedCycle: 'monthly',
  },
  {
    id: 'github',
    name: 'GitHub Pro',
    category: 'Productivity',
    icon: '💻',
    color: '#181717',
    suggestedPrice: 4,
    suggestedCycle: 'monthly',
  },

  // Fitness & Health
  {
    id: 'apple-fitness',
    name: 'Apple Fitness+',
    category: 'Health & Fitness',
    icon: '💪',
    color: '#FA233B',
    suggestedPrice: 9.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'peloton',
    name: 'Peloton',
    category: 'Health & Fitness',
    icon: '🚴',
    color: '#000000',
    suggestedPrice: 44,
    suggestedCycle: 'monthly',
  },
  {
    id: 'headspace',
    name: 'Headspace',
    category: 'Health & Fitness',
    icon: '🧘',
    color: '#F47B5E',
    suggestedPrice: 12.99,
    suggestedCycle: 'monthly',
  },

  // News & Reading
  {
    id: 'new-york-times',
    name: 'New York Times',
    category: 'News & Media',
    icon: '📰',
    color: '#000000',
    suggestedPrice: 17,
    suggestedCycle: 'monthly',
  },
  {
    id: 'medium',
    name: 'Medium',
    category: 'News & Media',
    icon: '📖',
    color: '#000000',
    suggestedPrice: 5,
    suggestedCycle: 'monthly',
  },
  {
    id: 'audible',
    name: 'Audible',
    category: 'News & Media',
    icon: '🎧',
    color: '#FF9900',
    suggestedPrice: 14.95,
    suggestedCycle: 'monthly',
  },

  // Gaming
  {
    id: 'playstation-plus',
    name: 'PlayStation Plus',
    category: 'Gaming',
    icon: '🎮',
    color: '#003087',
    suggestedPrice: 9.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'xbox-game-pass',
    name: 'Xbox Game Pass',
    category: 'Gaming',
    icon: '🎯',
    color: '#107C10',
    suggestedPrice: 9.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'nintendo-online',
    name: 'Nintendo Switch Online',
    category: 'Gaming',
    icon: '🕹️',
    color: '#E60012',
    suggestedPrice: 3.99,
    suggestedCycle: 'monthly',
  },

  // Other
  {
    id: 'icloud',
    name: 'iCloud+',
    category: 'Productivity',
    icon: '☁️',
    color: '#3693F3',
    suggestedPrice: 0.99,
    suggestedCycle: 'monthly',
  },
  {
    id: 'linkedin-premium',
    name: 'LinkedIn Premium',
    category: 'Professional',
    icon: '💼',
    color: '#0A66C2',
    suggestedPrice: 29.99,
    suggestedCycle: 'monthly',
  },
]

export const CATEGORIES = [
  'Entertainment',
  'Productivity',
  'Health & Fitness',
  'News & Media',
  'Gaming',
  'Professional',
  'Shopping',
  'Education',
  'Other',
]

export const getPlatformById = (id: string): Platform | undefined => {
  return POPULAR_PLATFORMS.find((p) => p.id === id)
}

export const getPlatformsByCategory = (category: string): Platform[] => {
  return POPULAR_PLATFORMS.filter((p) => p.category === category)
}
