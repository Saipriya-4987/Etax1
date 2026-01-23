import Link from 'next/link'
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Award, 
  Cpu, 
  HeartHandshake,
  Briefcase,
  Laptop,
  GraduationCap,
  Rocket,
  Building,
  Building2,
  Heart,
  FileText,
  Calculator,
  ShieldCheck,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui'
import { APP_CONFIG, PRICING_PLANS, TESTIMONIALS, TARGET_AUDIENCE } from '@/lib/constants'

// Icon mapping for target audience
const iconMap: Record<string, React.ElementType> = {
  Briefcase,
  Laptop,
  GraduationCap,
  Rocket,
  Building,
  Building2,
  Heart,
}

export default function HomePage() {
  return (
   <>
  {/* ================= HERO SECTION ================= */}
  <section className="relative bg-linear-to-br from-blue-900 to-indigo-900 text-white">
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Simple. Secure. Smart Tax Filing
      </h1>
      <p className="text-lg md:text-xl max-w-2xl mx-auto">
        ITR, GST & EPFO services backed by expert professionals.
      </p>
    </div>

    {/* Wave Divider */}
    <div className="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 120" fill="none">
        <path
          d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H0Z"
          fill="white"
        />
      </svg>
    </div>
  </section>

  {/* ============ ALL PAGE SECTIONS WRAPPER ============ */}
  {/* THIS ENSURES SPACE BETWEEN EVERY SECTION */}
  <main className="space-y-32 bg-white">

    {/* ================= FILE OPTIONS SECTION ================= */}
    <section className="pt-32 pb-24">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Start Your <span className="text-[#1E3A8A]">Tax Filing</span> Journey
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Choose your preferred filing method
          </p>
        </div>

        {/* Options Grid */}
        <div className="flex justify-center">
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl w-full">

            {/* ITR Expert */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 border border-blue-100 hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col">
              <h3 className="text-2xl font-bold mb-4">File ITR with Expert</h3>
              <p className="text-gray-600 mb-8 grow">
                Expert CA filing with accuracy, security, and maximum savings.
              </p>
              <Button className="mt-auto w-full">File with Expert</Button>
            </div>

            {/* ITR Self */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-10 border border-green-100 hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col">
              <h3 className="text-2xl font-bold mb-4">File ITR Yourself</h3>
              <p className="text-gray-600 mb-8 grow">
                Simple guided filing with full compliance support.
              </p>
              <Button className="mt-auto w-full">File ITR Now</Button>
            </div>

            {/* GST */}
            <div className="bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl p-10 border border-yellow-100 hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col">
              <h3 className="text-2xl font-bold mb-4">GST Filing</h3>
              <p className="text-gray-600 mb-8 grow">
                GST registration, returns & compliance for businesses.
              </p>
              <Button className="mt-auto w-full">File GST</Button>
            </div>

            {/* EPFO */}
            <div className="bg-linear-to-br from-purple-50 to-violet-50 rounded-2xl p-10 border border-purple-100 hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col">
              <h3 className="text-2xl font-bold mb-4">UAN / EPFO</h3>
              <p className="text-gray-600 mb-8 grow">
                PF activation, withdrawal & employee compliance.
              </p>
              <Button className="mt-auto w-full">Access EPFO</Button>
            </div>

          </div>
        </div>
      </div>
    </section>

    {/* ================= WHY CHOOSE US ================= */}
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose eTaxMentor</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Trusted experts, secure processes, and complete compliance—everything you need in one place.
        </p>
      </div>
    </section>

    {/* ================= TESTIMONIALS ================= */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">What Our Clients Say</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Thousands of users trust us for stress-free tax filing.
        </p>
      </div>
    </section>

    {/* ================= CTA ================= */}
    <section className="py-24 bg-linear-to-br from-blue-900 to-indigo-900 text-white text-center">
      <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
      <Button size="lg">Start Filing Today</Button>
    </section>

  </main>
</>

  )
}
