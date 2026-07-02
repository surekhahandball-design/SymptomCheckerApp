import { Link } from 'react-router-dom'
import { FaHeartbeat, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about' },
  { label: 'Services', to: '/#services' },
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
]

const socialLinks = [
  { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <FaHeartbeat className="text-white text-lg" />
              </div>
              <span className="font-bold text-lg text-white">
                Symptom<span className="text-secondary">Checker</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Your trusted AI-powered health companion for symptom analysis, disease insights, and doctor recommendations.
            </p>
            <div className="flex gap-3 mt-5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white hover:pl-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>AI Symptom Analysis</li>
              <li>Disease Prediction</li>
              <li>Doctor Recommendations</li>
              <li>Health History Tracking</li>
              <li>Appointment Booking</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-400">
                <HiOutlineLocationMarker className="text-primary text-lg flex-shrink-0 mt-0.5" />
                <span>123 Health Street, Medical District, Mumbai 400001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <HiOutlinePhone className="text-primary text-lg flex-shrink-0" />
                <a href="tel:+911800123456" className="hover:text-white transition">+91 1800-123-456</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <HiOutlineMail className="text-primary text-lg flex-shrink-0" />
                <a href="mailto:support@symptomchecker.com" className="hover:text-white transition">
                  support@symptomchecker.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SymptomChecker. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 text-center sm:text-right max-w-md">
            This tool is for informational purposes only and is not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
