import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Scale, FileText, Landmark } from 'lucide-react';

const sections = [
  {
    id: 'acceptance-of-terms',
    title: '1. Acceptance of Terms',
    content: [
      'By accessing, registering for, or using any Service offered by Orine Credit Bank LTD, you agree to comply with and be bound by these Terms, as well as any additional agreements, disclosures, fee schedules, or policies applicable to specific products or services.',
      'If you do not agree to these Terms, you must discontinue use of our Services immediately.',
    ],
  },
  {
    id: 'eligibility-and-account-opening',
    title: '2. Eligibility and Account Opening',
    content: ['To open and maintain an account with Orine Credit Bank LTD, you must:'],
    bullets: [
      'Be at least eighteen (18) years of age or the legal age of majority in your jurisdiction.',
      'Provide accurate, complete, and current information.',
      'Submit valid identification and documentation as required by law.',
      'Comply with all applicable local, state, federal, and international laws and regulations.',
    ],
    tail: 'We reserve the right to refuse account applications, limit services, or close accounts at our discretion, subject to applicable law.',
  },
  {
    id: 'account-maintenance-and-security',
    title: '3. Account Maintenance and Security',
    content: [
      'You are responsible for maintaining the confidentiality and security of your account credentials, including usernames, passwords, PINs, and authentication codes.',
      'You agree to:',
    ],
    bullets: [
      'Safeguard your login credentials.',
      'Not share your account access with unauthorized individuals.',
      'Notify us immediately of any suspected unauthorized access, fraud, or security breach.',
    ],
    tail: 'Orine Credit Bank LTD is not responsible for losses resulting from your failure to maintain the security of your account information.',
  },
  {
    id: 'banking-services-and-fees',
    title: '4. Banking Services and Fees',
    content: ['Orine Credit Bank LTD provides a range of financial products and services, which may include:'],
    bullets: [
      'Savings and checking accounts.',
      'Online and mobile banking services.',
      'Consumer and commercial loan products.',
      'Investment and wealth management services.',
      'Credit and debit card services.',
    ],
    tail: 'Specific terms, conditions, interest rates, and fees applicable to each product are disclosed in separate account agreements, disclosures, and fee schedules. By using a specific product, you agree to the terms governing that product. We reserve the right to modify, suspend, or discontinue any Service at any time, subject to applicable notice requirements.',
  },
  {
    id: 'privacy-and-data-protection',
    title: '5. Privacy and Data Protection',
    content: [
      'Your privacy is important to us. Our collection, use, and disclosure of personal information are governed by our Privacy Policy.',
      'By using our Services, you acknowledge that you have reviewed and understand our Privacy Policy.',
    ],
  },
  {
    id: 'electronic-communications-and-consent',
    title: '6. Electronic Communications and Consent',
    content: [
      'By using our Services, you consent to receive communications from Orine Credit Bank LTD electronically, including account statements, transaction confirmations, legal disclosures and notices, and service updates and alerts.',
      'Electronic communications may be delivered via email, secure online messages, mobile notifications, or through our website. You are responsible for maintaining accurate contact information and ensuring access to electronic communications.',
    ],
  },
  {
    id: 'limitation-of-liability',
    title: '7. Limitation of Liability',
    content: [
      'To the fullest extent permitted by law, Orine Credit Bank LTD shall not be liable for any indirect, incidental, consequential, special, exemplary, or punitive damages arising out of or related to your use of the Services.',
      'Our total liability for any claim arising under these Terms shall be limited to the amount of fees paid by you for the relevant Service, except where prohibited by law.',
      'Nothing in these Terms limits liability where such limitation is not permitted under applicable law.',
    ],
  },
  {
    id: 'suspension-and-termination',
    title: '8. Suspension and Termination',
    content: ['We reserve the right to suspend, restrict, or terminate your access to our Services if:'],
    bullets: [
      'You violate these Terms.',
      'We suspect fraudulent, unlawful, or unauthorized activity.',
      'Required by law or regulatory authority.',
    ],
    tail: 'You may close your account at any time, subject to applicable procedures and settlement of outstanding obligations.',
  },
  {
    id: 'amendments-to-terms',
    title: '9. Amendments to Terms',
    content: [
      'We may revise or update these Terms periodically to reflect changes in legal requirements, regulatory guidance, or business practices. Updated Terms will be posted on our website with a revised Effective Date.',
      'Your continued use of the Services after changes become effective constitutes acceptance of the revised Terms.',
    ],
  },
  {
    id: 'governing-law-and-jurisdiction',
    title: '10. Governing Law and Jurisdiction',
    content: [
      'These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to conflict of law principles.',
      'Any disputes arising out of or relating to these Terms or the Services shall be subject to the exclusive jurisdiction of the state and federal courts located in New York, unless otherwise required by applicable law.',
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 text-white">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.28) 1px, transparent 0)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="relative container mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto break-words">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs sm:text-sm">
              <Scale className="h-4 w-4" />
              Legal Information
            </div>
            <h1 className="mt-4 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">Terms of Service</h1>
            <p className="mt-4 text-blue-100 max-w-3xl text-sm sm:text-base">
              Effective Date: February 15, 2026
            </p>
            <p className="mt-2 text-blue-100 max-w-3xl text-sm sm:text-base leading-relaxed">
              These Terms of Service govern your access to and use of the financial products and
              services provided by Orine Credit Bank LTD, including our website, online banking
              platform, mobile applications, and related services.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm break-words">
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <FileText className="h-5 w-5 mt-0.5 shrink-0" />
            <p>
              By accessing or using any of our Services, you acknowledge that you have read,
              understood, and agree to be legally bound by these Terms.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <article key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{section.title}</h2>
                {section.content?.map((line) => (
                  <p key={line} className="mt-3 text-slate-700 leading-relaxed break-words">
                    {line}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 space-y-2 text-slate-700">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-2 leading-relaxed break-words">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.tail && <p className="mt-3 text-slate-700 leading-relaxed break-words">{section.tail}</p>}
              </article>
            ))}
          </div>

          <article id="contact-information" className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-blue-700" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">11. Contact Information</h2>
            </div>
            <p className="mt-3 text-slate-700">If you have questions regarding these Terms of Service, please contact:</p>
            <div className="mt-4 text-slate-800 space-y-1">
              <p className="font-semibold">Orine Credit Bank LTD</p>
              <p>123 Banking Street</p>
              <p>Financial District</p>
              <p>New York, NY 10001</p>
              <p>Email: customerservice@orinecbl.com</p>
              <p>Phone: 1-800-BANKING</p>
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
