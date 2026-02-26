import { ShieldCheck, Undo2, HeadphonesIcon } from 'lucide-react'

export default function GuaranteeSection() {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A2E] mb-2">
            Your Satisfaction, Guaranteed
          </h2>
          <p className="text-gray-600">We stand behind every installation — here&apos;s our promise to you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-[#F8F9FA] rounded-xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
              <ShieldCheck size={28} className="text-[#00C853]" />
            </div>
            <h3 className="font-bold text-[#1A1A2E] mb-2">100% Satisfaction Guarantee</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you&apos;re not completely satisfied with your Vivint system, we&apos;ll work with you to make it right.
            </p>
          </div>

          <div className="text-center p-6 bg-[#F8F9FA] rounded-xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
              <Undo2 size={28} className="text-[#00C853]" />
            </div>
            <h3 className="font-bold text-[#1A1A2E] mb-2">No Obligation Quote</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your free consultation is exactly that — free. No credit card required, no pressure to buy. Get the info you need to decide.
            </p>
          </div>

          <div className="text-center p-6 bg-[#F8F9FA] rounded-xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
              <HeadphonesIcon size={28} className="text-[#00C853]" />
            </div>
            <h3 className="font-bold text-[#1A1A2E] mb-2">24/7 Customer Support</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Vivint&apos;s award-winning support team is available around the clock — by phone, chat, or app — whenever you need help.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
