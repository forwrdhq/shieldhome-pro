export interface QuizOption {
  value: string
  label: string
  icon: string
  badge?: string
}

export interface QuizQuestionData {
  id: number
  question: string
  subtext: string | null
  type: 'single_select' | 'multi_select'
  options: QuizOption[]
  renterWarning?: boolean
  showContinueButton?: boolean
}

export const QUIZ_QUESTIONS: QuizQuestionData[] = [
  {
    id: 1,
    question: 'What type of property do you want to protect?',
    subtext: null,
    type: 'single_select',
    options: [
      { value: 'house', label: 'Single-Family Home', icon: '\u{1F3E0}' },
      { value: 'townhouse', label: 'Townhouse', icon: '\u{1F3D8}\u{FE0F}' },
      { value: 'condo', label: 'Condo / Apartment', icon: '\u{1F3E2}' },
      { value: 'multi_family', label: 'Multi-Family', icon: '\u{1F3D7}\u{FE0F}' },
    ],
  },
  {
    id: 2,
    question: 'Do you own or rent your home?',
    subtext: null,
    type: 'single_select',
    renterWarning: true,
    options: [
      { value: 'own', label: 'I Own My Home', icon: '\u{1F511}' },
      { value: 'rent', label: 'I Rent', icon: '\u{1F4CB}' },
      { value: 'buying', label: "I'm Buying Soon", icon: '\u{1F3E1}' },
    ],
  },
  {
    id: 3,
    question: "What's your biggest security concern right now?",
    subtext: 'Select the one that matters most',
    type: 'single_select',
    options: [
      { value: 'breakins', label: 'Break-ins / Burglary', icon: '\u{1F513}' },
      { value: 'package_theft', label: 'Package Theft', icon: '\u{1F4E6}' },
      { value: 'fire_co', label: 'Fire / CO Detection', icon: '\u{1F525}' },
      { value: 'kids_alone', label: 'Kids Home Alone', icon: '\u{1F476}' },
      { value: 'vacation', label: 'Vacation Monitoring', icon: '\u{2708}\u{FE0F}' },
    ],
  },
  {
    id: 4,
    question: 'How would you describe your neighborhood?',
    subtext: null,
    type: 'single_select',
    options: [
      { value: 'very_safe', label: 'Very Safe', icon: '\u{1F7E2}' },
      { value: 'safe_but_concerns', label: 'Safe, But Growing Concerns', icon: '\u{1F7E1}' },
      { value: 'some_incidents', label: 'Some Recent Incidents', icon: '\u{1F7E0}' },
      { value: 'high_crime', label: 'High Crime Area', icon: '\u{1F534}' },
    ],
  },
  {
    id: 5,
    question: 'Do you currently have any security system?',
    subtext: null,
    type: 'single_select',
    options: [
      { value: 'none', label: 'No Security System', icon: '\u{274C}' },
      { value: 'basic_diy', label: 'Basic DIY (Ring, cameras)', icon: '\u{1F4F9}' },
      { value: 'outdated', label: 'Outdated / Not Working', icon: '\u{26A0}\u{FE0F}' },
      { value: 'unhappy_professional', label: 'Professional (But Unhappy)', icon: '\u{1F624}' },
    ],
  },
  {
    id: 6,
    question: 'Which smart features interest you most?',
    subtext: 'Select all that apply',
    type: 'multi_select',
    showContinueButton: true,
    options: [
      { value: 'doorbell_cam', label: 'Video Doorbell', icon: '\u{1F6AA}' },
      { value: 'outdoor_cameras', label: 'Outdoor Cameras', icon: '\u{1F4F7}' },
      { value: 'smart_locks', label: 'Smart Locks', icon: '\u{1F510}' },
      { value: 'smoke_co', label: 'Smoke / CO Sensors', icon: '\u{1F4A8}' },
      { value: 'all', label: 'All of the Above', icon: '\u{2705}' },
    ],
  },
  {
    id: 7,
    question: 'When are you looking to get protected?',
    subtext: null,
    type: 'single_select',
    options: [
      { value: 'asap', label: 'As Soon As Possible', icon: '\u{26A1}', badge: 'Most Popular' },
      { value: 'within_30_days', label: 'Within 30 Days', icon: '\u{1F4C5}' },
      { value: 'within_3_months', label: 'Within 3 Months', icon: '\u{1F5D3}\u{FE0F}' },
      { value: 'researching', label: 'Just Researching', icon: '\u{1F50D}' },
    ],
  },
]

export const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length
