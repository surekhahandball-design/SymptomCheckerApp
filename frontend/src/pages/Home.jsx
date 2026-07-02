import { Link } from 'react-router-dom'
import {
  FaBrain,
  FaStethoscope,
  FaUserMd,
  FaHistory,
  FaShieldAlt,
  FaBolt,
  FaCheckCircle,
  FaLock,
  FaCalendarCheck,
  FaLaptopMedical,
} from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'
import './Home.css'

const features = [
  {
    icon: FaBrain,
    title: 'AI Symptom Analysis',
    description: 'Intelligent analysis of your symptoms using advanced rule-based and AI-driven health algorithms.',
  },
  {
    icon: FaStethoscope,
    title: 'Disease Prediction',
    description: 'Get possible disease matches with probability scores, severity levels, and health precautions.',
  },
  {
    icon: FaUserMd,
    title: 'Doctor Recommendations',
    description: 'Find verified doctors by specialization, location, and ratings near you.',
  },
  {
    icon: FaHistory,
    title: 'Health History',
    description: 'Track all your symptom checks and health records in one secure, accessible place.',
  },
  {
    icon: FaShieldAlt,
    title: 'Secure User Accounts',
    description: 'JWT-authenticated accounts with encrypted passwords and role-based access control.',
  },
  {
    icon: FaBolt,
    title: 'Fast & Responsive',
    description: 'Lightning-fast performance on desktop, tablet, and mobile with a modern interface.',
  },
]

const whyChooseUs = [
  {
    icon: FaCheckCircle,
    title: 'Accurate Symptom Analysis',
    description: 'Our system cross-references symptoms against a comprehensive medical database for reliable insights.',
  },
  {
    icon: FaLock,
    title: 'Secure Data Privacy',
    description: 'Your health data is protected with industry-standard encryption and never shared without consent.',
  },
  {
    icon: FaCalendarCheck,
    title: 'Easy Appointment Booking',
    description: 'Book appointments with verified doctors in just a few clicks, right from your dashboard.',
  },
  {
    icon: FaLaptopMedical,
    title: 'Modern User Interface',
    description: 'A clean, intuitive design built for everyone — from first-time users to healthcare professionals.',
  },
]

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="home-hero text-white py-20 md:py-28 lg:py-32">
        <div className="home-hero-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-white/15 backdrop-blur-sm text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in-up">
              Trusted Healthcare Technology
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up animate-delay-100">
              Check Your Symptoms,{' '}
              <span className="text-secondary">Protect Your Health</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
              Analyze your symptoms instantly and get possible health insights with our intelligent symptom checker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300">
              <Link
                to="/register"
                className="cta-btn inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-3.5 rounded-full font-semibold text-base hover:bg-blue-50"
              >
                Get Started
                <HiArrowRight />
              </Link>
              <Link
                to="/login"
                className="cta-btn inline-flex items-center justify-center gap-2 border-2 border-white/80 text-white px-8 py-3.5 rounded-full font-semibold text-base hover:bg-white hover:text-primary"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Our Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">
              Everything You Need for Better Health
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Comprehensive health tools designed to help you understand your symptoms and take informed action.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="feature-card bg-white border border-gray-100 rounded-2xl p-7 shadow-sm"
              >
                <div className="feature-icon-wrap w-14 h-14 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="text-2xl" />
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-20 bg-light scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2 mb-4">
                Your Health, Our Priority
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                SymptomChecker combines medical knowledge with modern technology to give you reliable health insights,
                secure data handling, and seamless access to healthcare professionals.
              </p>
              <Link
                to="/register"
                className="cta-btn inline-flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-full font-semibold hover:bg-blue-700 shadow-md shadow-primary/25"
              >
                Create Free Account
                <HiArrowRight />
              </Link>
            </div>

            <div className="space-y-4">
              {whyChooseUs.map((item) => (
                <div
                  key={item.title}
                  className="why-item flex gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                >
                  <div className="w-11 h-11 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of users who trust SymptomChecker for instant health insights and doctor recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="cta-btn inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-3.5 rounded-full font-semibold hover:bg-blue-50"
            >
              Get Started Free
              <HiArrowRight />
            </Link>
            <Link
              to="/login"
              className="cta-btn inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white hover:text-primary"
            >
              Login to Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
