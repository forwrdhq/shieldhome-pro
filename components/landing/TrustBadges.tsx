import { Shield, Lock, Award, CheckCircle } from 'lucide-react'

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
      <div className="flex items-center gap-1.5 text-gray-600">
        <Lock size={16} className="text-[#00C853]" />
        <span className="text-xs font-medium">256-bit SSL Encrypted</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-600">
        <Shield size={16} className="text-[#00C853]" />
        <span className="text-xs font-medium">BBB A+ Accredited</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-600">
        <Award size={16} className="text-[#00C853]" />
        <span className="text-xs font-medium">SafeHome.org #1 Rated</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-600">
        <CheckCircle size={16} className="text-[#00C853]" />
        <span className="text-xs font-medium">2M+ Homes Protected</span>
      </div>
    </div>
  )
}
