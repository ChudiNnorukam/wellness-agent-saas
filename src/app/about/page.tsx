'use client';

import Link from 'next/link';
import { Heart, Sparkles, Target, Award, Globe, ArrowRight, Shield, Code, Zap } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Empathy First",
      description: "I understand that wellness is deeply personal. Every feature I build starts with understanding your unique journey."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Evidence-Based",
      description: "My recommendations are grounded in scientific research and validated wellness practices."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Privacy & Security",
      description: "Your health data is sacred. I protect it with enterprise-grade security and never sell your information."
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Innovation",
      description: "I continuously push the boundaries of what's possible with AI to deliver better wellness outcomes."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "WellnessAI Launches",
      description: "My AI-powered wellness platform goes live, helping users transform their well-being through personalized guidance."
    },
    {
      year: "2023",
      title: "Development & Research",
      description: "Intensive research and development, building the foundation for personalized wellness AI technology."
    },
    {
      year: "2022",
      title: "Vision Born",
      description: "The idea for WellnessAI is conceived with a mission to make personalized wellness accessible to everyone."
    }
  ];

  const skills = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Full-Stack Development",
      description: "Next.js, React, TypeScript, Node.js"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI & Machine Learning",
      description: "OpenAI, LangChain, Vector Databases"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Cloud & DevOps",
      description: "Vercel, AWS, CI/CD, Monitoring"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Wellness Research",
      description: "Health psychology, nutrition, fitness"
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
            My Mission
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
              Join My Mission
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

      {/* Founder Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Meet Chudi Nnorukam
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  Hi, I'm Chudi Nnorukam, the founder and developer behind WellnessAI. I'm passionate 
                  about leveraging technology to solve real-world problems, particularly in the wellness space.
                </p>
                <p>
                  WellnessAI was born from a simple observation: while technology has transformed 
                  nearly every aspect of our lives, personalized wellness guidance remained out of 
                  reach for most people.
                </p>
                <p>
                  As a solo developer and entrepreneur, I believe in the power of AI to democratize 
                  access to personalized wellness guidance. My goal is to help people achieve their 
                  wellness goals through intelligent, data-driven recommendations.
                </p>
                <p>
                  I'm committed to building a platform that's not just technologically advanced, 
                  but also genuinely helpful and accessible to everyone.
                </p>
              </div>
            </div>
            <div className="bg-emerald-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl text-white font-bold">CN</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Chudi Nnorukam</h3>
                <p className="text-emerald-600 font-medium mb-4">Founder & Developer</p>
                <p className="text-gray-600 mb-6">
                  Full-stack developer passionate about AI-powered wellness solutions
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">100%</div>
                    <div className="text-gray-600">Solo Built</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">24/7</div>
                    <div className="text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              My Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The technical skills and knowledge that power WellnessAI's personalized recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, index) => (
              <div key={index} className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="bg-emerald-100 rounded-full p-3 w-fit mx-auto mb-6">
                  <div className="text-emerald-600">
                    {skill.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{skill.title}</h3>
                <p className="text-gray-600">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              My Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything I do, from product development to customer support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 text-center hover:bg-emerald-50 transition-colors">
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

      {/* Milestones Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              My Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in my mission to democratize personalized wellness.
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
            Join me in transforming wellness
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
              Work With Me
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
            <p>&copy; 2024 WellnessAI by Chudi Nnorukam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 