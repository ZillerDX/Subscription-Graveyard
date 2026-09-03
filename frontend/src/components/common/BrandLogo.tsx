/**
 * Real Brand Vector Logo Component
 * Renders official brand SVGs using react-icons/si with fallback to name-based detection or monogram.
 */
import React from 'react'
import {
  SiYoutube,
  SiNetflix,
  SiSpotify,
  SiOpenai,
  SiApple,
  SiAmazon,
  SiGithub,
  SiAdobe,
  SiNotion,
  SiFigma,
  SiCanva,
  SiGoogle,
  SiSlack,
  SiDiscord,
  SiDropbox,
  SiDuolingo,
  SiGrammarly,
  SiLinkedin,
  SiSteam,
  SiPlaystation,
} from 'react-icons/si'

export interface BrandInfo {
  id: string
  name: string
  category: string
  color: string
  bgColor: string
  icon: React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>
  suggestedCost: number
  suggestedCycle: 'monthly' | 'yearly'
  defaultHours: number // Default suggested monthly hours
}

export const BRAND_PRESETS: BrandInfo[] = [
  {
    id: 'youtube',
    name: 'YouTube Premium',
    category: 'Entertainment',
    color: '#FF0000',
    bgColor: '#FFF0F0',
    icon: SiYoutube,
    suggestedCost: 13.99,
    suggestedCycle: 'monthly',
    defaultHours: 35,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Entertainment',
    color: '#E50914',
    bgColor: '#FFF0F1',
    icon: SiNetflix,
    suggestedCost: 15.49,
    suggestedCycle: 'monthly',
    defaultHours: 20,
  },
  {
    id: 'spotify',
    name: 'Spotify Premium',
    category: 'Entertainment',
    color: '#1DB954',
    bgColor: '#F0FDF4',
    icon: SiSpotify,
    suggestedCost: 10.99,
    suggestedCycle: 'monthly',
    defaultHours: 45,
  },
  {
    id: 'openai',
    name: 'ChatGPT Plus',
    category: 'Productivity',
    color: '#10A37F',
    bgColor: '#ECFDF5',
    icon: SiOpenai,
    suggestedCost: 20.00,
    suggestedCycle: 'monthly',
    defaultHours: 25,
  },
  {
    id: 'apple',
    name: 'iCloud+ / Apple One',
    category: 'Productivity',
    color: '#000000',
    bgColor: '#F4F4F5',
    icon: SiApple,
    suggestedCost: 9.99,
    suggestedCycle: 'monthly',
    defaultHours: 15,
  },
  {
    id: 'amazon',
    name: 'Amazon Prime',
    category: 'Shopping',
    color: '#FF9900',
    bgColor: '#FFFBEB',
    icon: SiAmazon,
    suggestedCost: 14.99,
    suggestedCycle: 'monthly',
    defaultHours: 10,
  },
  {
    id: 'github',
    name: 'GitHub Pro / Copilot',
    category: 'Productivity',
    color: '#24292F',
    bgColor: '#F4F4F5',
    icon: SiGithub,
    suggestedCost: 10.00,
    suggestedCycle: 'monthly',
    defaultHours: 40,
  },
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    category: 'Productivity',
    color: '#FF0000',
    bgColor: '#FFF0F0',
    icon: SiAdobe,
    suggestedCost: 54.99,
    suggestedCycle: 'monthly',
    defaultHours: 30,
  },
  {
    id: 'notion',
    name: 'Notion Plus',
    category: 'Productivity',
    color: '#000000',
    bgColor: '#F4F4F5',
    icon: SiNotion,
    suggestedCost: 8.00,
    suggestedCycle: 'monthly',
    defaultHours: 25,
  },
  {
    id: 'figma',
    name: 'Figma Professional',
    category: 'Productivity',
    color: '#F24E1E',
    bgColor: '#FFF5F3',
    icon: SiFigma,
    suggestedCost: 12.00,
    suggestedCycle: 'monthly',
    defaultHours: 35,
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    category: 'Productivity',
    color: '#00C4CC',
    bgColor: '#F0FDFA',
    icon: SiCanva,
    suggestedCost: 12.99,
    suggestedCycle: 'monthly',
    defaultHours: 12,
  },
  {
    id: 'google',
    name: 'Google One / Workspace',
    category: 'Productivity',
    color: '#4285F4',
    bgColor: '#EFF6FF',
    icon: SiGoogle,
    suggestedCost: 9.99,
    suggestedCycle: 'monthly',
    defaultHours: 20,
  },
  {
    id: 'discord',
    name: 'Discord Nitro',
    category: 'Entertainment',
    color: '#5865F2',
    bgColor: '#EEF2FF',
    icon: SiDiscord,
    suggestedCost: 9.99,
    suggestedCycle: 'monthly',
    defaultHours: 28,
  },
  {
    id: 'slack',
    name: 'Slack Pro',
    category: 'Productivity',
    color: '#4A154B',
    bgColor: '#FAF5FF',
    icon: SiSlack,
    suggestedCost: 8.75,
    suggestedCycle: 'monthly',
    defaultHours: 50,
  },
  {
    id: 'playstation',
    name: 'PlayStation Plus',
    category: 'Gaming',
    color: '#003791',
    bgColor: '#EFF6FF',
    icon: SiPlaystation,
    suggestedCost: 9.99,
    suggestedCycle: 'monthly',
    defaultHours: 18,
  },
  {
    id: 'steam',
    name: 'Steam',
    category: 'Gaming',
    color: '#171A21',
    bgColor: '#F4F4F5',
    icon: SiSteam,
    suggestedCost: 14.99,
    suggestedCycle: 'monthly',
    defaultHours: 25,
  },
  {
    id: 'duolingo',
    name: 'Duolingo Super',
    category: 'Education',
    color: '#58CC02',
    bgColor: '#F7FEE7',
    icon: SiDuolingo,
    suggestedCost: 6.99,
    suggestedCycle: 'monthly',
    defaultHours: 8,
  },
  {
    id: 'grammarly',
    name: 'Grammarly Premium',
    category: 'Productivity',
    color: '#15C39A',
    bgColor: '#F0FDF4',
    icon: SiGrammarly,
    suggestedCost: 12.00,
    suggestedCycle: 'monthly',
    defaultHours: 15,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Premium',
    category: 'Professional',
    color: '#0A66C2',
    bgColor: '#EFF6FF',
    icon: SiLinkedin,
    suggestedCost: 29.99,
    suggestedCycle: 'monthly',
    defaultHours: 4,
  },
  {
    id: 'dropbox',
    name: 'Dropbox Plus',
    category: 'Productivity',
    color: '#0061FF',
    bgColor: '#EFF6FF',
    icon: SiDropbox,
    suggestedCost: 11.99,
    suggestedCycle: 'monthly',
    defaultHours: 6,
  },
]

export function detectLogoKey(name?: string, explicitKey?: string | null): string | null {
  if (explicitKey && BRAND_PRESETS.some((b) => b.id === explicitKey)) {
    return explicitKey
  }
  if (!name) return null
  const n = name.toLowerCase()
  if (n.includes('youtube')) return 'youtube'
  if (n.includes('netflix')) return 'netflix'
  if (n.includes('spotify')) return 'spotify'
  if (n.includes('chatgpt') || n.includes('openai')) return 'openai'
  if (n.includes('apple') || n.includes('icloud')) return 'apple'
  if (n.includes('amazon') || n.includes('prime')) return 'amazon'
  if (n.includes('github') || n.includes('copilot')) return 'github'
  if (n.includes('adobe') || n.includes('photoshop')) return 'adobe'
  if (n.includes('notion')) return 'notion'
  if (n.includes('figma')) return 'figma'
  if (n.includes('canva')) return 'canva'
  if (n.includes('google') || n.includes('drive')) return 'google'
  if (n.includes('discord')) return 'discord'
  if (n.includes('slack')) return 'slack'
  if (n.includes('playstation')) return 'playstation'
  if (n.includes('steam')) return 'steam'
  if (n.includes('duolingo')) return 'duolingo'
  if (n.includes('grammarly')) return 'grammarly'
  if (n.includes('linkedin')) return 'linkedin'
  if (n.includes('dropbox')) return 'dropbox'
  return null
}

interface BrandLogoProps {
  logoKey?: string | null
  name?: string
  className?: string
  iconClassName?: string
  size?: number
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  logoKey,
  name,
  className = 'w-10 h-10 rounded-xl',
  iconClassName,
  size = 20,
}) => {
  const resolvedKey = detectLogoKey(name, logoKey)
  const brand = BRAND_PRESETS.find((b) => b.id === resolvedKey)

  if (brand) {
    const Icon = brand.icon
    return (
      <div
        className={`flex items-center justify-center shrink-0 border border-black/5 shadow-xs transition-transform duration-200 ${className}`}
        style={{ backgroundColor: brand.bgColor }}
      >
        <Icon
          size={size}
          className={`shrink-0 ${iconClassName || ''}`}
          style={{ color: brand.color }}
        />
      </div>
    )
  }

  // Fallback for custom names: clean minimal monogram with pastel background
  const initials = (name || 'SG')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div
      className={`flex items-center justify-center shrink-0 bg-[#F7D6D0]/40 border border-[#E2B4BD]/40 text-[#4A4A4A] font-bold text-xs tracking-wider shadow-xs ${className}`}
    >
      {initials}
    </div>
  )
}

export default BrandLogo
