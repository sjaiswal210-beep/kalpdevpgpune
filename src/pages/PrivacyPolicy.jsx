import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen font-poppins bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-white/70 text-sm">KalpDev PG — Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-gray-700">
        <Section title="Introduction">
          KalpDev PG ("we", "our", "us") operates the KalpDev PG management application and website
          (kalpdevpg.online). This Privacy Policy explains how we collect, use, and protect your
          personal information when you use our services.
        </Section>

        <Section title="Information We Collect">
          <p className="mb-2">We collect the following information to provide our PG management services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name, phone number, and email address</li>
            <li>Room and bed assignment details</li>
            <li>Aadhaar number (for verification, stored securely)</li>
            <li>Emergency contact and parent/guardian details</li>
            <li>Blood group (for safety purposes)</li>
            <li>Rent payment records and history</li>
            <li>Visitor details you register</li>
          </ul>
        </Section>

        <Section title="How We Use Your Information">
          <ul className="list-disc pl-6 space-y-1">
            <li>To manage room allocation and tenancy records</li>
            <li>To track rent payments and send payment reminders</li>
            <li>To maintain visitor logs for security</li>
            <li>To communicate important notices and announcements</li>
            <li>To provide the rewards and referral program</li>
          </ul>
        </Section>

        <Section title="Data Storage & Security">
          Your data is stored securely using Google Firebase (Firestore), a trusted cloud database
          service. We implement reasonable security measures to protect your personal information
          from unauthorized access, alteration, or disclosure.
        </Section>

        <Section title="Data Sharing">
          We do not sell, trade, or rent your personal information to third parties. Basic details
          (name, room, phone, blood group) may be visible to other residents within the PG for
          community and safety purposes. Payment information is only visible to PG administration.
        </Section>

        <Section title="Payments">
          Rent payments are made directly through UPI apps (GPay, PhonePe, Paytm, etc.) to the PG's
          UPI ID. We do not store your bank details, card numbers, or UPI credentials. We only record
          the payment amount, date, and confirmation status.
        </Section>

        <Section title="Third-Party Links">
          Our rewards section may contain affiliate links to Amazon and other shopping platforms.
          These external sites have their own privacy policies, and we are not responsible for their
          practices.
        </Section>

        <Section title="Your Rights">
          You may request access to, correction of, or deletion of your personal data at any time by
          contacting the PG administration. You can update most of your profile details directly
          through the tenant portal.
        </Section>

        <Section title="Children's Privacy">
          Our services are intended for adult residents. We do not knowingly collect information from
          children under 18 without parental/guardian consent.
        </Section>

        <Section title="Changes to This Policy">
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated revision date.
        </Section>

        <Section title="Contact Us">
          If you have questions about this Privacy Policy, contact us:
          <div className="mt-2 space-y-1">
            <p>📞 Phone: +91 73507 85606</p>
            <p>📧 Email: info@kalpdevpg.com</p>
            <p>🌐 Website: kalpdevpg.online</p>
          </div>
        </Section>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="flex items-center justify-center gap-2 text-white">
          <Building2 className="w-5 h-5 text-purple-400" />
          <span className="font-semibold">KalpDev PG</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">© {new Date().getFullYear()} KalpDev PG. All rights reserved.</p>
      </footer>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-sm leading-relaxed text-gray-600">{children}</div>
    </div>
  );
}
