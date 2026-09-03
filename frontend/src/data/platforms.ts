/**
 * Popular subscription platforms data with brand logos and default usage hours
 */
import { BillingCycle } from '../types/subscription'

export interface Platform {
  id: string
  name: string
  category: string
  logoKey: string
  color: string
  suggestedPrice: number
  suggestedCycle: BillingCycle
  suggestedHours: number
}

export const POPULAR_PLATFORMS: Platform[] = [
  // Streaming Services
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    category: 'Entertainment',
    logoKey: 'youtube',
    color: '#FF0000',
    suggestedPrice: 13.99,
    suggestedCycle: 'monthly',
    suggestedHours: 35,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Entertainment',
    logoKey: 'netflix',
    color: '#E50914',
    suggestedPrice: 15.49,
    suggestedCycle: 'monthly',
    suggestedHours: 20,
  },
  {
    id: 'spotify',
    name: 'Spotify Premium',
    category: 'Entertainment',
    logoKey: 'spotify',
    color: '#1DB954',
    suggestedPrice: 10.99,
    suggestedCycle: 'monthly',
    suggestedHours: 45,
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    category: 'Productivity',
    logoKey: 'openai',
    color: '#10A37F',
    suggestedPrice: 20.00,
    suggestedCycle: 'monthly',
    suggestedHours: 30,
  },
  {
    id: 'apple-one',
    name: 'Apple One / iCloud+',
    category: 'Productivity',
    logoKey: 'apple',
    color: '#000000',
    suggestedPrice: 9.99,
    suggestedCycle: 'monthly',
    suggestedHours: 25,
  },
  {
    id: 'amazon-prime',
    name: 'Amazon Prime',
    category: 'Shopping',
    logoKey: 'amazon',
    color: '#FF9900',
    suggestedPrice: 14.99,
    suggestedCycle: 'monthly',
    suggestedHours: 12,
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot / Pro',
    category: 'Productivity',
    logoKey: 'github',
    color: '#181717',
    suggestedPrice: 10.00,
    suggestedCycle: 'monthly',
    suggestedHours: 40,
  },
  {
    id: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    category: 'Productivity',
    logoKey: 'adobe',
    color: '#FF0000',
    suggestedPrice: 54.99,
    suggestedCycle: 'monthly',
    suggestedHours: 30,
  },
  {
    id: 'notion-plus',
    name: 'Notion Plus',
    category: 'Productivity',
    logoKey: 'notion',
    color: '#000000',
    suggestedPrice: 8.00,
    suggestedCycle: 'monthly',
    suggestedHours: 20,
  },
  {
    id: 'figma-pro',
    name: 'Figma Professional',
    category: 'Productivity',
    logoKey: 'figma',
    color: '#F24E1E',
    suggestedPrice: 12.00,
    suggestedCycle: 'monthly',
    suggestedHours: 35,
  },
  {
    id: 'canva-pro',
    name: 'Canva Pro',
    category: 'Productivity',
    logoKey: 'canva',
    color: '#00C4CC',
    suggestedPrice: 12.99,
    suggestedCycle: 'monthly',
    suggestedHours: 15,
  },
  {
    id: 'google-one',
    name: 'Google One',
    category: 'Productivity',
    logoKey: 'google',
    color: '#4285F4',
    suggestedPrice: 9.99,
    suggestedCycle: 'monthly',
    suggestedHours: 25,
  },
  {
    id: 'discord-nitro',
    name: 'Discord Nitro',
    category: 'Entertainment',
    logoKey: 'discord',
    color: '#5865F2',
    suggestedPrice: 9.99,
    suggestedCycle: 'monthly',
    suggestedHours: 30,
  },
  {
    id: 'slack-pro',
    name: 'Slack Pro',
    category: 'Productivity',
    logoKey: 'slack',
    color: '#4A154B',
    suggestedPrice: 8.75,
    suggestedCycle: 'monthly',
    suggestedHours: 50,
  },
  {
    id: 'playstation-plus',
    name: 'PlayStation Plus',
    category: 'Gaming',
    logoKey: 'playstation',
    color: '#003087',
    suggestedPrice: 9.99,
    suggestedCycle: 'monthly',
    suggestedHours: 20,
  },
  {
    id: 'duolingo-super',
    name: 'Duolingo Super',
    category: 'Education',
    logoKey: 'duolingo',
    color: '#58CC02',
    suggestedPrice: 6.99,
    suggestedCycle: 'monthly',
    suggestedHours: 10,
  },
  {
    id: 'linkedin-premium',
    name: 'LinkedIn Premium',
    category: 'Professional',
    logoKey: 'linkedin',
    color: '#0A66C2',
    suggestedPrice: 29.99,
    suggestedCycle: 'monthly',
    suggestedHours: 5,
  },
  {
    id: 'dropbox-plus',
    name: 'Dropbox Plus',
    category: 'Productivity',
    logoKey: 'dropbox',
    color: '#0061FF',
    suggestedPrice: 11.99,
    suggestedCycle: 'monthly',
    suggestedHours: 8,
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
