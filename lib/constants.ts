export const SKILL_OPTIONS = [
  'Python',
  'JavaScript',
  'React',
  'Node.js',
  'Java',
  'C#',
  'SQL',
  'AWS',
  'TypeScript',
  'Docker',
]

export const UNIVERSITIES = [
  'TCD',
  'UCD',
  'DCU',
  'TU Dublin',
  'NCI',
  'Maynooth',
  'UL',
  'UCC',
  'NUIG',
  'ATU',
  'SETU',
  'MTU',
]

export const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Other',
]

export const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+']

export const MIN_HOURLY_RATE = 12.7

/** Badge definitions — earned client-side from stats */
export type Badge = {
  id: string
  label: string
  description: string
  icon: string
  earned: boolean
}

export function computeBadges(completedProjects: number, hourlyRate: number): Badge[] {
  return [
    {
      id: 'first-project',
      label: 'First Project',
      description: 'Completed your first project',
      icon: '🌱',
      earned: completedProjects >= 1,
    },
    {
      id: 'five-projects',
      label: '5 Projects',
      description: 'Completed 5 projects',
      icon: '⭐',
      earned: completedProjects >= 5,
    },
    {
      id: 'ten-projects',
      label: 'Job Ready',
      description: '10+ projects — eligible for permanent role referrals',
      icon: '🏆',
      earned: completedProjects >= 10,
    },
    {
      id: 'tier-2',
      label: '€15/hr Tier',
      description: 'Hourly rate at or above €15',
      icon: '💚',
      earned: hourlyRate >= 15,
    },
    {
      id: 'tier-3',
      label: '€20/hr Tier',
      description: 'Hourly rate at or above €20',
      icon: '💛',
      earned: hourlyRate >= 20,
    },
    {
      id: 'tier-4',
      label: '€25/hr Tier',
      description: 'Hourly rate at or above €25 — top tier',
      icon: '👑',
      earned: hourlyRate >= 25,
    },
  ]
}
