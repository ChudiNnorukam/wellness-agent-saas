'use client';

import Link from 'next/link';
import { Heart, Sparkles, Users, Target, Award, Globe, ArrowRight, Shield } from 'lucide-react';

export default function AboutPage() {
  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Wellness Officer",
      bio: "Former clinical psychologist with 15+ years in wellness research. PhD from Stanford University.",
      image: "👩‍⚕️"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of AI & Technology",
      bio: "AI researcher with expertise in machine learning for healthcare. Previously at Google Health.",
      image: "👨‍💻"
    },
    {
      name: "Emily Johnson",
      role: "VP of Product",
      bio: "Product leader with experience building successful health tech products. MBA from Harvard.",
      image: "👩‍💼"
    },
    {
      name: "David Kim",
      role: "Head of Engineering",
      bio: "Full-stack engineer with 10+ years building scalable health applications.",
      image: "👨‍🔧"
    }
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Empathy First",
      description: "We understand that wellness is deeply personal. Every feature we build starts with understanding your unique journey."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Evidence-Based",
      description: "Our recommendations are grounded in scientific research and validated wellness practices."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Privacy & Security",
      description: "Your health data is sacred. We protect it with enterprise-grade security and never sell your information."
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible with AI to deliver better wellness outcomes."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "WellnessAI Launches",
      description: "Our AI-powered wellness platform goes live, helping thousands of users transform their well-being."
    },
    {
      year: "2023",
      title: "Research & Development",
      description: "Two years of intensive research and development, building the foundation for personalized wellness AI."
    },
    {
      year: "2022",
      title: "Company Founded",
      description: "WellnessAI is founded with a mission to make personalized wellness accessible to everyone."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">WellnessAI</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Home
              </Link>
              <Link href="/features" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Pricing
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Contact
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Login
              </Link>
              <Link
                href="/generate"
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our Mission
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            To democratize personalized wellness by making AI-powered health guidance accessible, 
            affordable, and effective for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors text-lg font-semibold"
            >
              Join Our Mission
            </Link>
            <Link
              href="/contact"
              className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg hover:bg-emerald-50 transition-colors text-lg font-semibold"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The WellnessAI Story
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  WellnessAI was born from a simple observation: while technology has transformed 
                  nearly every aspect of our lives, personalized wellness guidance remained out of 
                  reach for most people.
                </p>
                <p>
                  Our founders, a team of AI researchers, healthcare professionals, and wellness 
                  experts, came together with a shared vision: to leverage the power of artificial 
                  intelligence to make personalized wellness guidance accessible to everyone.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 users worldwide, helping them achieve 
                  their wellness goals through AI-powered personalized plans and guidance.
                </p>
              </div>
            </div>
            <div className="bg-emerald-100 rounded-2xl p-8">
              <div className="text-center">
                <Globe className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Global Impact</h3>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">50K+</div>
                    <div className="text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">150+</div>
                    <div className="text-gray-600">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">95%</div>
                    <div className="text-gray-600">Satisfaction Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">24/7</div>
                    <div className="text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do, from product development to customer support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="bg-emerald-100 rounded-full p-3 w-fit mx-auto mb-6">
                  <div className="text-emerald-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind WellnessAI, dedicated to transforming wellness through technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 text-center hover:bg-emerald-50 transition-colors">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our mission to democratize personalized wellness.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-8">
                <div className="bg-emerald-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl">
                  {milestone.year}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Join us in transforming wellness
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Be part of the movement to make personalized wellness accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              className="bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold flex items-center justify-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors text-lg font-semibold"
            >
              Work With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-emerald-400" />
                <span className="text-2xl font-bold">WellnessAI</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transform your well-being with AI-powered personalized wellness plans.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/generate" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 WellnessAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 