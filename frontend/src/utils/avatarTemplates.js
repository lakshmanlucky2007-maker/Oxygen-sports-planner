// Consistent color palette for backgrounds
const COLORS = {
  blue: '#3b82f6',
  indigo: '#6366f1',
  emerald: '#10b981',
  teal: '#14b8a6',
  violet: '#8b5cf6',
  purple: '#a855f7',
  rose: '#f43f5e',
  pink: '#ec4899',
  amber: '#f59e0b',
  orange: '#f97316',
  slate: '#64748b',
  darkIndigo: '#312e81'
};

export const AVATAR_TEMPLATES = [
  {
    id: 'avatar_m1',
    gender: 'male',
    label: 'Active Runner (Blue)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="${COLORS.blue}"/>
      <path d="M 44 65 L 56 65 L 56 78 L 44 78 Z" fill="#e0a96d" />
      <circle cx="50" cy="46" r="22" fill="#f5c796"/>
      <path d="M 30 38 Q 50 16 70 38 C 70 28 62 22 50 22 C 38 22 30 28 30 38 Z" fill="#2d3748"/>
      <circle cx="43" cy="46" r="2" fill="#1a202c"/>
      <circle cx="57" cy="46" r="2" fill="#1a202c"/>
      <path d="M 45 54 Q 50 59 55 54" stroke="#1a202c" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 24 90 C 24 76 34 72 50 72 C 66 72 76 76 76 90 Z" fill="#ef4444"/>
    </svg>`
  },
  {
    id: 'avatar_f1',
    gender: 'female',
    label: 'Pro Racket Coach (Violet)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="${COLORS.violet}"/>
      <path d="M 45 65 L 55 65 L 55 78 L 45 78 Z" fill="#f3c19b" />
      <circle cx="50" cy="45" r="21" fill="#fcdbb0"/>
      <path d="M 28 42 C 28 22 40 18 50 18 C 60 18 72 22 72 42 C 72 58 68 62 68 62 C 68 62 64 45 50 45 C 36 45 32 62 32 62 C 32 62 28 58 28 42 Z" fill="#4a3728"/>
      <circle cx="44" cy="43" r="2" fill="#1a202c"/>
      <circle cx="56" cy="43" r="2" fill="#1a202c"/>
      <path d="M 46 51 Q 50 55 54 51" stroke="#1a202c" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 24 90 C 24 76 36 74 50 74 C 64 74 76 76 76 90 Z" fill="#fbbf24"/>
    </svg>`
  },
  {
    id: 'avatar_n1',
    gender: 'neutral',
    label: 'Apex Athlete (Teal)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="${COLORS.teal}"/>
      <circle cx="50" cy="50" r="32" fill="none" stroke="white" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.3"/>
      <path d="M 32 68 L 50 32 L 68 68 Z" fill="white" opacity="0.9"/>
      <circle cx="50" cy="30" r="6" fill="#f59e0b"/>
      <path d="M 40 76 L 60 76" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
    </svg>`
  },
  {
    id: 'avatar_m2',
    gender: 'male',
    label: 'Varsity Caps (Orange)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="${COLORS.orange}"/>
      <path d="M 45 65 L 55 65 L 55 78 L 45 78 Z" fill="#dfa570" />
      <circle cx="50" cy="47" r="21" fill="#f7cdab"/>
      <circle cx="43" cy="46" r="2" fill="#1a202c"/>
      <circle cx="57" cy="46" r="2" fill="#1a202c"/>
      <path d="M 46 54 Q 50 58 54 54" stroke="#1a202c" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 28 32 C 34 26 44 26 50 26 C 56 26 66 26 72 32 C 72 32 74 38 74 40 L 26 40 C 26 38 28 32 28 32 Z" fill="#2b6cb0"/>
      <path d="M 50 26 L 50 22 C 50 22 55 21 58 22" stroke="#2b6cb0" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 40 40 L 76 34" stroke="#3182ce" stroke-width="4" stroke-linecap="round"/>
      <path d="M 24 90 C 24 76 36 74 50 74 C 64 74 76 76 76 90 Z" fill="#2d3748"/>
    </svg>`
  },
  {
    id: 'avatar_f2',
    gender: 'female',
    label: 'Athletic Glasses (Rose)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="${COLORS.rose}"/>
      <path d="M 45 65 L 55 65 L 55 78 L 45 78 Z" fill="#dda477" />
      <circle cx="50" cy="46" r="21" fill="#f8cfad"/>
      <path d="M 28 42 C 28 26 36 22 50 22 C 64 22 72 26 72 42 C 72 48 70 54 70 54 L 30 54 C 30 54 28 48 28 42 Z" fill="#e53e3e"/>
      <circle cx="43" cy="45" r="7" stroke="#1a202c" stroke-width="2" fill="none"/>
      <circle cx="57" cy="45" r="7" stroke="#1a202c" stroke-width="2" fill="none"/>
      <line x1="50" y1="45" x2="50" y2="45" stroke="#1a202c" stroke-width="2"/>
      <path d="M 46 55 Q 50 58 54 55" stroke="#1a202c" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <path d="M 24 90 C 24 76 36 72 50 72 C 64 72 76 76 76 90 Z" fill="#4a5568"/>
    </svg>`
  },
  {
    id: 'avatar_n2',
    gender: 'neutral',
    label: 'Pitch Victory (Indigo)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="${COLORS.indigo}"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="white" stroke-width="2" opacity="0.2"/>
      <path d="M 38 62 C 38 52 42 46 50 46 C 58 46 62 52 62 62" stroke="white" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/>
      <path d="M 50 26 L 50 40" stroke="#f6e05e" stroke-width="4" stroke-linecap="round" />
      <path d="M 44 32 L 50 26 L 56 32" stroke="#f6e05e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </svg>`
  },
  {
    id: 'avatar_m3',
    gender: 'male',
    label: 'Bearded Striker (Emerald)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="${COLORS.emerald}"/>
      <path d="M 45 65 L 55 65 L 55 78 L 45 78 Z" fill="#c68a4c" />
      <circle cx="50" cy="46" r="21" fill="#e6ad75"/>
      <path d="M 32 44 Q 50 18 68 44" stroke="#1a202c" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M 31 46 C 31 58 36 68 50 68 C 64 68 69 58 69 46 C 69 46 62 50 50 50 C 38 50 31 46 31 46 Z" fill="#2d3748"/>
      <circle cx="43" cy="44" r="2" fill="#1a202c"/>
      <circle cx="57" cy="44" r="2" fill="#1a202c"/>
      <path d="M 46 52 Q 50 56 54 52" stroke="#e6ad75" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 24 90 C 24 76 36 74 50 74 C 64 74 76 76 76 90 Z" fill="#3182ce"/>
    </svg>`
  },
  {
    id: 'avatar_f3',
    gender: 'female',
    label: 'Sleek Headband (Teal)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="${COLORS.teal}"/>
      <path d="M 45 65 L 55 65 L 55 78 L 45 78 Z" fill="#e8bc92" />
      <circle cx="50" cy="46" r="21" fill="#ffdcb9"/>
      <path d="M 29 40 C 29 25 32 18 50 18 C 68 18 71 25 71 40 C 71 58 66 64 66 64 L 34 64 C 34 64 29 58 29 40 Z" fill="#718096"/>
      <rect x="28" y="32" width="44" height="6" fill="#ecc94b" rx="2"/>
      <circle cx="43" cy="46" r="2" fill="#1a202c"/>
      <circle cx="57" cy="46" r="2" fill="#1a202c"/>
      <path d="M 46 53 Q 50 57 54 53" stroke="#1a202c" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 24 90 C 24 76 36 72 50 72 C 64 72 76 76 76 90 Z" fill="#319795"/>
    </svg>`
  },
  {
    id: 'avatar_n3',
    gender: 'neutral',
    label: 'Gold Trophy (Dark)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="${COLORS.darkIndigo}"/>
      <path d="M 32 30 H 68 V 44 C 68 54 60 62 50 62 C 40 62 32 54 32 44 Z" fill="#ecc94b"/>
      <path d="M 46 62 H 54 V 74 H 46 Z" fill="#ecc94b"/>
      <path d="M 38 74 H 62 V 78 H 38 Z" fill="#ecc94b"/>
      <path d="M 32 34 C 26 34 26 44 32 44" stroke="#ecc94b" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M 68 34 C 74 34 74 44 68 44" stroke="#ecc94b" stroke-width="4" stroke-linecap="round" fill="none"/>
      <polygon points="50,34 53,40 60,40 55,44 57,51 50,47 43,51 45,44 40,40 47,40" fill="#ffffff"/>
    </svg>`
  },
  {
    id: 'avatar_m4',
    gender: 'male',
    label: 'Sport Sunglasses (Slate)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="${COLORS.slate}"/>
      <path d="M 45 65 L 55 65 L 55 78 L 45 78 Z" fill="#dda374" />
      <circle cx="50" cy="46" r="21" fill="#f8cfab"/>
      <path d="M 31 38 Q 50 20 69 38 C 69 32 62 26 50 26 C 38 26 31 32 31 38 Z" fill="#1a202c"/>
      <path d="M 33 42 H 67 L 63 50 H 37 Z" fill="#2b6cb0" opacity="0.9"/>
      <line x1="33" y1="42" x2="67" y2="42" stroke="#1a202c" stroke-width="2"/>
      <path d="M 46 54 Q 50 58 54 54" stroke="#1a202c" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <path d="M 24 90 C 24 76 36 74 50 74 C 64 74 76 76 76 90 Z" fill="#d69e2e"/>
    </svg>`
  },
  {
    id: 'avatar_f4',
    gender: 'female',
    label: 'Top Bun (Pink)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="${COLORS.pink}"/>
      <path d="M 45 65 L 55 65 L 55 78 L 45 78 Z" fill="#f1be96" />
      <circle cx="50" cy="22" r="10" fill="#319795"/>
      <circle cx="50" cy="47" r="21" fill="#fadab7"/>
      <path d="M 29 44 C 29 32 36 28 50 28 C 64 28 71 32 71 44 C 71 50 69 54 69 54 L 31 54 C 31 54 29 50 29 44 Z" fill="#319795"/>
      <circle cx="43" cy="46" r="2" fill="#1a202c"/>
      <circle cx="57" cy="46" r="2" fill="#1a202c"/>
      <path d="M 46 53 Q 50 57 54 53" stroke="#1a202c" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 24 90 C 24 76 36 74 50 74 C 64 74 76 76 76 90 Z" fill="#ed64a6"/>
    </svg>`
  },
  {
    id: 'avatar_n4',
    gender: 'neutral',
    label: 'Speed Bolt (Amber)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="${COLORS.amber}"/>
      <circle cx="50" cy="50" r="32" fill="none" stroke="white" stroke-width="2" opacity="0.2"/>
      <path d="M 52 20 L 36 50 H 50 L 46 80 L 64 44 H 48 Z" fill="white" opacity="0.9"/>
    </svg>`
  }
];

/**
 * Generate a beautiful circular initials-based avatar as an SVG data URI
 * @param {string} name 
 * @returns {string} SVG data URI
 */
export function getInitialsAvatar(name) {
  const cleanName = (name || 'User').trim();
  const initials = cleanName
    .split(/\s+/)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#14B8A6', '#F97316', '#6366F1',
    '#00c0f0', '#0090ff', '#ff3080', '#00b070'
  ];

  // Hash name to select color consistently
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" rx="24" fill="${color}"/>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="Plus Jakarta Sans, Inter, sans-serif" font-size="36" font-weight="800" letter-spacing="-1">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Select a random avatar from the 12 templates
 * @returns {string} SVG data URI
 */
export function getRandomAvatar() {
  const index = Math.floor(Math.random() * AVATAR_TEMPLATES.length);
  const template = AVATAR_TEMPLATES[index];
  return `data:image/svg+xml;utf8,${encodeURIComponent(template.svg)}`;
}
