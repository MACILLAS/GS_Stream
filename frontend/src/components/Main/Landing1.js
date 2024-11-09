import React from 'react';
import {
  ArrowRight,
  Radio,
  Cpu,
  Eye,
  ArrowUpRight,
  Wifi,
  Shield,
  Search,
  Zap,
  Navigation,
  Compass,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Navigation className="w-8 h-8 text-sky-600" />,
      title: 'Autonomous Drone',
      description:
        'AI-powered drones for automated inspection and precise data collection',
    },
    {
      icon: <Cpu className="w-8 h-8 text-sky-600" />,
      title: 'Real-time Analysis',
      description: '5G-enabled instant data processing and anomaly detection',
    },
    {
      icon: <Eye className="w-8 h-8 text-sky-600" />,
      title: '3D Visualization',
      description: 'High-resolution 3D modeling with millimeter-level accuracy',
    },
  ];

  const solutions = [
    {
      icon: <Radio className="w-12 h-12 text-sky-600" />,
      title: '5G Tower Inspection',
      description: 'Comprehensive analysis of 5G infrastructure and components',
      badge: '5G Ready',
    },
    {
      icon: <Zap className="w-12 h-12 text-sky-600" />,
      title: 'Drone Navigation',
      description: 'Precision flight paths with obstacle avoidance',
      badge: 'AI Powered',
    },
    {
      icon: <Compass className="w-12 h-12 text-sky-600" />,
      title: 'Digital Twin',
      description: 'Real-time 3D modeling and monitoring system',
      badge: 'Advanced Tech',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 font-sans">
      {/* Header */}
      <header className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600 leading-normal">
            TowerEye AI
            <span style={{ fontSize: '0.75em', verticalAlign: 'super' }}>
              ™
            </span>{' '}
          </h1>
          <div className="space-x-6">
            <a
              href="#features"
              className="text-slate-600 hover:text-sky-600 transition-colors font-medium leading-normal"
            >
              Features
            </a>
            <a
              href="#solutions"
              className="text-slate-600 hover:text-sky-600 transition-colors font-medium leading-normal"
            >
              Solutions
            </a>
            <a
              href="/render"
              className="bg-sky-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-sky-700 transition-all shadow-lg hover:shadow-sky-200 inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl transform -skew-y-3"></div>
          </div>
          <div className="py-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600 leading-normal md:leading-tight max-w-4xl mx-auto pt-2">
                Next-Gen 5G Tower
                <br />
                Drone Inspection System
              </h2>
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-1 rounded-full text-sm font-semibold">
                <Wifi className="w-4 h-4" /> 5G-Enabled Drone Technology
              </div>
              <p className="text-lg mb-2 max-w-2xl mx-auto text-slate-600 leading-relaxed">
                Revolutionize telecom infrastructure maintenance with our
                autonomous drone system, powered by 5G connectivity and advanced
                AI analytics.
              </p>
              <a
                href="/render"
                className="bg-sky-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-sky-700 transition-all shadow-xl hover:shadow-sky-200 inline-flex items-center gap-2"
              >
                Launch Inspection
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center text-slate-800 leading-normal">
            Advanced Drone Inspection Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-sky-100 group"
              >
                <div className="flex items-center justify-center mb-4 bg-sky-50 w-14 h-14 rounded-lg group-hover:bg-sky-100 transition-colors">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold mb-2 text-slate-800 leading-snug">
                  {feature.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center text-slate-800 leading-normal">
            Integrated Solutions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-sky-100 group cursor-pointer relative"
              >
                <div className="absolute top-4 right-4 bg-sky-100 text-sky-700 px-2 py-1 rounded-full text-xs font-medium">
                  {solution.badge}
                </div>
                <div className="flex items-center justify-center mb-4 bg-sky-50 w-16 h-16 rounded-lg group-hover:bg-sky-100 transition-colors">
                  {solution.icon}
                </div>
                <h4 className="text-lg font-bold mb-2 text-slate-800 leading-snug">
                  {solution.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4 text-white leading-normal">
              Experience the Future of Tower Inspection
            </h3>
            <p className="text-sky-100 mb-6 max-w-2xl mx-auto leading-relaxed">
              Join the revolution in telecom infrastructure maintenance with our
              5G-powered drone inspection system.
            </p>
            <a
              href="/render"
              className="bg-white text-sky-600 px-6 py-2.5 rounded-lg text-lg font-semibold hover:bg-sky-50 transition-colors inline-flex items-center gap-2"
            >
              Schedule Demo
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 mt-8 border-t border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 leading-normal">
            © 2024 Towereye AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-slate-600 hover:text-sky-600 transition-colors leading-normal"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-sky-600 transition-colors leading-normal"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-sky-600 transition-colors leading-normal"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
