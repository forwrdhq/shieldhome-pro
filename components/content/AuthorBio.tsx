import { cn } from '@/lib/utils'

interface AuthorBioProps {
  name?: string
  role?: string
  bio?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function AuthorBio({
  name = 'ShieldHome Pro Team',
  role = 'Home Security Experts',
  bio = 'Our team of home security professionals has over 20 years of combined experience helping homeowners find the right security solutions. We research, test, and review the latest smart home security systems so you can make informed decisions.',
}: AuthorBioProps) {
  const initials = getInitials(name)

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-slate-100 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{initials}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-slate-900">{name}</h4>
          <p className="text-sm text-emerald-500 font-medium mb-2">{role}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>
        </div>
      </div>
    </div>
  )
}
