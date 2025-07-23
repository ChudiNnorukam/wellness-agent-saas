import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | WellnessAI - AI-Powered Wellness Optimization',
  description: 'Learn how WellnessAI collects, uses, and protects your personal data. Our comprehensive privacy policy ensures transparency and compliance with GDPR, CCPA, and other privacy regulations.',
  keywords: 'privacy policy, data protection, GDPR, CCPA, wellness AI, personal data, data security',
  openGraph: {
    title: 'Privacy Policy | WellnessAI',
    description: 'Transparent privacy policy for WellnessAI - Learn how we protect your data',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            WellnessAI ("we," "our," or "us") is committed to protecting your privacy.
          </p>
        </header>

        {/* Navigation */}
        <nav className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <a href="#information-collection" className="block text-blue-600 hover:text-blue-800 transition-colors">
                • Information We Collect
              </a>
              <a href="#how-we-use" className="block text-blue-600 hover:text-blue-800 transition-colors">
                • How We Use Your Information
              </a>
              <a href="#data-sharing" className="block text-blue-600 hover:text-blue-800 transition-colors">
                • Data Sharing and Disclosure
              </a>
              <a href="#data-security" className="block text-blue-600 hover:text-blue-800 transition-colors">
                • Data Security
              </a>
            </div>
            <div className="space-y-2">
              <a href="#your-rights" className="block text-blue-600 hover:text-blue-800 transition-colors">
                • Your Rights and Choices
              </a>
              <a href="#cookies" className="block text-blue-600 hover:text-blue-800 transition-colors">
                • Cookies and Tracking
              </a>
              <a href="#third-party" className="block text-blue-600 hover:text-blue-800 transition-colors">
                • Third-Party Services
              </a>
              <a href="#contact" className="block text-blue-600 hover:text-blue-800 transition-colors">
                • Contact Information
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to WellnessAI, an AI-powered wellness optimization platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. By using WellnessAI, you agree to the collection and use of information in accordance with this policy.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              We are committed to protecting your privacy and ensuring the security of your personal data. This policy complies with applicable privacy laws including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and other relevant regulations.
            </p>
          </section>

          {/* Information Collection */}
          <section id="information-collection">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Account Information:</strong> Name, email address, password, and profile information</li>
                  <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely through Stripe)</li>
                  <li><strong>Wellness Data:</strong> Health goals, preferences, activity data, and wellness metrics you choose to share</li>
                  <li><strong>Communication Data:</strong> Messages, feedback, and support requests you send to us</li>
                  <li><strong>Profile Information:</strong> Age, gender, location, and other demographic information you choose to provide</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Usage Data:</strong> How you interact with our platform, features used, and time spent</li>
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                  <li><strong>Log Data:</strong> Server logs, error reports, and performance metrics</li>
                  <li><strong>Location Data:</strong> General location information (city/country level) for service optimization</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Third-Party Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Social Media:</strong> Information from social media platforms when you connect accounts</li>
                  <li><strong>Fitness Apps:</strong> Data from connected fitness and wellness applications</li>
                  <li><strong>Analytics Services:</strong> Aggregated usage statistics from Google Analytics and similar services</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section id="how-we-use">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Primary Uses</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Provide and maintain our wellness optimization services</li>
                  <li>Personalize your experience and recommendations</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Send important service updates and notifications</li>
                  <li>Provide customer support and respond to inquiries</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Analytics and Improvement</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Analyze usage patterns to improve our services</li>
                  <li>Develop new features and functionality</li>
                  <li>Conduct research and development</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Legal and Compliance</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Comply with legal obligations and regulations</li>
                  <li>Enforce our Terms of Service</li>
                  <li>Protect our rights and prevent misuse</li>
                  <li>Respond to legal requests and investigations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section id="data-sharing">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">We Do Not Sell Your Data</h3>
                <p className="text-gray-700">
                  WellnessAI does not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Limited Sharing Scenarios</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform (hosting, payment processing, analytics)</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Safety and Security:</strong> To protect our users, platform, or the public from harm</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Data Processing Agreements</h3>
                <p className="text-gray-700">
                  All third-party service providers are bound by strict data processing agreements and are prohibited from using your information for any purpose other than providing services to WellnessAI.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section id="data-security">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-gray-800 mb-3">Security Measures</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols</li>
                  <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms</li>
                  <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
                  <li><strong>Data Backup:</strong> Regular backups with disaster recovery procedures</li>
                  <li><strong>Employee Training:</strong> Security awareness training for all team members</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Data Retention</h3>
                <p className="text-gray-700 mb-4">
                  We retain your personal information only as long as necessary to provide our services and comply with legal obligations:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Account Data:</strong> Retained while your account is active and for 30 days after deletion</li>
                  <li><strong>Payment Information:</strong> Retained as required by financial regulations</li>
                  <li><strong>Analytics Data:</strong> Aggregated and anonymized after 2 years</li>
                  <li><strong>Legal Records:</strong> Retained as required by applicable laws</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section id="your-rights">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Access and Control</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Access your personal data</li>
                  <li>Update or correct your information</li>
                  <li>Download your data (data portability)</li>
                  <li>Delete your account and data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Privacy Settings</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Control data sharing preferences</li>
                  <li>Manage notification settings</li>
                  <li>Adjust privacy levels</li>
                  <li>Review connected accounts</li>
                  <li>Set data retention preferences</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">How to Exercise Your Rights</h3>
              <p className="text-gray-700 mb-3">
                You can exercise these rights through your account settings or by contacting us directly. We will respond to your request within 30 days.
              </p>
              <p className="text-gray-700">
                <strong>Contact:</strong> privacy@wellnessai.com or use the contact form below.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section id="cookies">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Types of Cookies We Use</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Essential Cookies</h4>
                    <p className="text-sm text-gray-700">
                      Required for basic functionality, security, and account management.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Analytics Cookies</h4>
                    <p className="text-sm text-gray-700">
                      Help us understand how users interact with our platform.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Preference Cookies</h4>
                    <p className="text-sm text-gray-700">
                      Remember your settings and personalize your experience.
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Marketing Cookies</h4>
                    <p className="text-sm text-gray-700">
                      Used for targeted advertising and content recommendations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Cookie Management</h3>
                <p className="text-gray-700">
                  You can control cookies through your browser settings. However, disabling certain cookies may affect platform functionality. 
                  We also provide a cookie consent banner that allows you to manage your preferences.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section id="third-party">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Our platform integrates with third-party services to enhance functionality:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Payment Processing</h4>
                  <p className="text-sm text-gray-700">
                    Stripe processes payments securely. Review their privacy policy at stripe.com/privacy
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Analytics</h4>
                  <p className="text-sm text-gray-700">
                    Google Analytics helps us understand usage patterns. Review their privacy policy at policies.google.com/privacy
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Hosting</h4>
                  <p className="text-sm text-gray-700">
                    Vercel provides secure cloud hosting services. Review their privacy policy at vercel.com/privacy
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Database</h4>
                  <p className="text-sm text-gray-700">
                    Supabase provides secure database services. Review their privacy policy at supabase.com/privacy
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-gray-700">
                WellnessAI is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. 
                If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </div>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Data Transfers</h2>
            <p className="text-gray-700">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place 
              to protect your data in accordance with this Privacy Policy and applicable laws.
            </p>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of 
              any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our service 
              after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section id="contact">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Email</h4>
                  <p className="text-gray-700">privacy@wellnessai.com</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Data Protection Officer</h4>
                  <p className="text-gray-700">dpo@wellnessai.com</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Mailing Address</h4>
                <p className="text-gray-700">
                  WellnessAI<br />
                  Attn: Privacy Team<br />
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
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
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