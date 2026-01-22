import Link from 'next/link'
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail } from 'lucide-react'
import { NAV_LINKS, APP_CONFIG } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-[#1E3A8A] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Company Info (UNCHANGED) */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#1E3A8A] font-bold text-lg">eT</span>
              </div>
              <span className="text-2xl font-bold">eTaxMentor</span>
            </Link>

            <p className="text-white text-sm leading-relaxed mb-6">
              Our mission is to empower businesses and individuals with seamless, technology-driven 
              financial solutions that simplify compliance, optimize tax strategies, and drive growth.
            </p>

            <div className="flex gap-3">
              <a href={APP_CONFIG.social.facebook} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={18} className="!text-white" />
              </a>
              <a href={APP_CONFIG.social.instagram} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={18} className="!text-white" />
              </a>
              <a href={APP_CONFIG.social.twitter} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={18} className="!text-white" />
              </a>
              <a href={APP_CONFIG.social.linkedin} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin size={18} className="!text-white" />
              </a>
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 !text-white">
              Information
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.footer.information.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm !text-white hover:!text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 !text-white">
              Our Services
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.footer.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm !text-white hover:!text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 !text-white">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${APP_CONFIG.phone}`}
                  className="flex items-start gap-3 text-sm !text-white hover:!text-white transition-colors"
                >
                  <Phone size={18} className="mt-0.5 shrink-0 !text-white" />
                  <span>{APP_CONFIG.phone}</span>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${APP_CONFIG.email}`}
                  className="flex items-start gap-3 text-sm !text-white hover:!text-white transition-colors"
                >
                  <Mail size={18} className="mt-0.5 shrink-0 !text-white" />
                  <span>{APP_CONFIG.email}</span>
                </a>
              </li>

              <li className="flex items-start gap-3 text-sm !text-white">
                <img 
                  src="https://media.istockphoto.com/id/1160540754/vector/map-location-pointer-3d-pin-with-glowing-glass-bubble-navigation-icon-for-web-banner-logo-or.jpg?s=612x612&w=0&k=20&c=1xSqoYrwPh8ssfmS2CkFmL-1sJslDp8s9TsFNidJdg4=" 
                  alt="Map Icon" 
                  className="mt-0.5 shrink-0 w-[18px] h-[18px] text-red-600" 
                />
                <span>{APP_CONFIG.address}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar (UNCHANGED) */}
      <div className="border-t border-blue-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white text-sm">
              Copyright © {new Date().getFullYear()} eTaxMentor. All Rights Reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {NAV_LINKS.footer.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
