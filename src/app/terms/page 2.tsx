import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | WellnessAI - AI-Powered Wellness Optimization',
  description: 'Read WellnessAI Terms of Service to understand your rights and obligations when using our AI-powered wellness optimization platform.',
  keywords: 'terms of service, user agreement, wellness AI, SaaS terms, legal agreement',
  openGraph: {
    title: 'Terms of Service | WellnessAI',
    description: 'Terms of Service for WellnessAI - Understand your rights and obligations',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please read these Terms of Service carefully before using WellnessAI.
          </p>
        </header>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using WellnessAI ("Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              These Terms of Service ("Terms") govern your use of the WellnessAI platform, including all features, functionality, and services 
              provided by WellnessAI ("we," "us," or "our").
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              WellnessAI is an AI-powered wellness optimization platform that provides:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Personalized wellness recommendations and insights</li>
              <li>AI-driven health and fitness optimization</li>
              <li>Progress tracking and analytics</li>
              <li>Integration with third-party wellness applications</li>
              <li>Community features and support</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Account Creation</h3>
                <p className="text-gray-700">
                  To access certain features of the Service, you must create an account. You agree to provide accurate, current, and complete 
                  information during registration and to update such information to keep it accurate, current, and complete.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Account Security</h3>
                <p className="text-gray-700">
                  You are responsible for safeguarding the password and for all activities that occur under your account. You agree to notify 
                  us immediately of any unauthorized use of your account.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Account Termination</h3>
                <p className="text-gray-700">
                  We reserve the right to terminate or suspend your account at any time for violations of these Terms or for any other reason 
                  at our sole discretion.
                </p>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
            
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Permitted Uses</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Using the Service for personal wellness optimization</li>
                  <li>Sharing wellness insights with authorized users</li>
                  <li>Integrating with supported third-party applications</li>
                  <li>Providing feedback and suggestions for improvement</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Prohibited Uses</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Violating any applicable laws or regulations</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Interfering with or disrupting the Service</li>
                  <li>Using the Service for medical diagnosis or treatment</li>
                  <li>Sharing account credentials with others</li>
                  <li>Reverse engineering or attempting to extract source code</li>
                  <li>Using the Service for commercial purposes without authorization</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Subscription and Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Subscription and Payment</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Subscription Plans</h3>
                <p className="text-gray-700">
                  WellnessAI offers various subscription plans with different features and pricing. All subscriptions are billed in advance 
                  on a recurring basis.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Payment Processing</h3>
                <p className="text-gray-700">
                  Payments are processed securely through Stripe. By providing payment information, you authorize us to charge the applicable 
                  fees to your payment method.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Cancellation and Refunds</h3>
                <p className="text-gray-700">
                  You may cancel your subscription at any time through your account settings. Refunds are provided in accordance with our 
                  refund policy, typically within 30 days of purchase for unused portions of the service.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property Rights</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Our Rights</h3>
                <p className="text-gray-700">
                  The Service and its original content, features, and functionality are owned by WellnessAI and are protected by international 
                  copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Your Rights</h3>
                <p className="text-gray-700">
                  You retain ownership of any content you submit to the Service. By submitting content, you grant us a non-exclusive, 
                  worldwide, royalty-free license to use, modify, and display such content in connection with the Service.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">License to Use</h3>
                <p className="text-gray-700">
                  We grant you a limited, non-exclusive, non-transferable license to access and use the Service for your personal, 
                  non-commercial use in accordance with these Terms.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, 
              which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.
            </p>
            <div className="mt-4">
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                View our Privacy Policy
              </Link>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimers</h2>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Medical Disclaimer</h3>
                <p className="text-gray-700">
                  WellnessAI is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease. Always consult 
                  with qualified healthcare professionals for medical advice.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Service Availability</h3>
                <p className="text-gray-700">
                  We strive to maintain high availability but do not guarantee uninterrupted access to the Service. We may temporarily 
                  suspend the Service for maintenance or updates.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Accuracy of Information</h3>
                <p className="text-gray-700">
                  While we strive for accuracy, we do not guarantee that all information provided through the Service is complete, 
                  accurate, or up-to-date.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-gray-700">
                To the maximum extent permitted by law, WellnessAI shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
                intangible losses, resulting from your use of the Service.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700">
              You agree to defend, indemnify, and hold harmless WellnessAI and its officers, directors, employees, and agents from 
              and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service 
              or violation of these Terms.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Termination by You</h3>
                <p className="text-gray-700">
                  You may terminate your account at any time by deleting your account through the Service or contacting us directly.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Termination by Us</h3>
                <p className="text-gray-700">
                  We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates 
                  these Terms or is harmful to other users or the Service.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Effect of Termination</h3>
                <p className="text-gray-700">
                  Upon termination, your right to use the Service will cease immediately. We may delete your account and data, 
                  though we may retain certain information as required by law.
                </p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to 
              its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of [Your Jurisdiction].
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the 
              new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such changes 
              constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Email</h4>
                  <p className="text-gray-700">legal@wellnessai.com</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Support</h4>
                  <p className="text-gray-700">support@wellnessai.com</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Mailing Address</h4>
                <p className="text-gray-700">
                  WellnessAI<br />
                  Attn: Legal Team<br />
                  [Your Business Address]<br />
                  [City, State, ZIP]
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <footer className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/features" className="hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} WellnessAI. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
} 