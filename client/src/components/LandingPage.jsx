import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Leaf, 
  Globe, 
  TrendingUp, 
  Shield, 
  Users, 
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Award,
  Target,
  BarChart3,
  Cpu,
  Database,
  Lock
} from 'lucide-react';

const LandingPage = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className="w-12 h-12 text-yellow-400" />,
      title: "Green Hydrogen Production",
      description: "Revolutionary AI-powered monitoring for sustainable hydrogen generation",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Leaf className="w-12 h-12 text-green-400" />,
      title: "Carbon Intensity Tracking",
      description: "Real-time monitoring of environmental impact and efficiency",
      color: "from-green-400 to-teal-500"
    },
    {
      icon: <Globe className="w-12 h-12 text-blue-400" />,
      title: "Blockchain Verification",
      description: "Immutable credit tracking and transparent trading platform",
      color: "from-blue-400 to-purple-500"
    }
  ];

  const stats = [
    { number: "500+", label: "Companies", icon: <Users className="w-6 h-6" /> },
    { number: "10M+", label: "Credits Issued", icon: <Award className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Shield className="w-6 h-6" /> },
    { number: "24/7", label: "Monitoring", icon: <Cpu className="w-6 h-6" /> }
  ];

  const benefits = [
    "AI-Powered IoT Monitoring",
    "Real-time Carbon Tracking",
    "Blockchain Verification",
    "Automated Compliance",
    "Smart Contract Integration",
    "Environmental Scoring"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-green-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">GreenChain</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex space-x-4">
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Green</span>
              <span className="text-white"> Hydrogen</span>
              <br />
              <span className="gradient-text-blue">Blue</span>
              <span className="text-white"> Carbon</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              The future of sustainable energy is here. Monitor, track, and trade green hydrogen credits 
              with AI-powered precision and blockchain transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup" className="btn-primary text-lg px-8 py-4 group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="glass-button text-lg px-8 py-4 group">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Revolutionary</span> Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the power of next-generation green energy technology
            </p>
          </div>

          <div className="modern-grid-3 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="modern-card text-center p-8 hover-lift">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Animated Feature Showcase */}
          <div className="modern-card p-12 text-center">
            <div className="flex justify-center mb-8">
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${features[currentFeature].color} flex items-center justify-center transition-all duration-500 transform scale-110`}>
                {features[currentFeature].icon}
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4 text-white">{features[currentFeature].title}</h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{features[currentFeature].description}</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="modern-grid-2">
            {stats.map((stat, index) => (
              <div key={index} className="modern-card text-center p-8 hover-lift">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400/20 to-blue-500/20 flex items-center justify-center">
                  <div className="text-green-400">{stat.icon}</div>
                </div>
                <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">GreenChain</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join the revolution in sustainable energy management
            </p>
          </div>

          <div className="modern-grid-2">
            <div className="modern-card p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Advanced Technology</h3>
              <div className="space-y-4">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modern-card p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Industry Leading</h3>
              <div className="space-y-4">
                {benefits.slice(3).map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="modern-card p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Transform</span> Your Energy Future?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of companies already using GreenChain to monitor and trade green hydrogen credits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                Get Started Free
              </Link>
              <button className="btn-outline text-lg px-8 py-4">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">GreenChain</span>
            </div>
            <p className="text-gray-400 mb-6">
              © 2024 GreenChain. All rights reserved. Building a sustainable future together.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;