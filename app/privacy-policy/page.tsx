import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

const sections = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: [
      'We collect information that is necessary to provide financial services, comply with legal obligations, and protect against fraud and security risks.',
    ],
    bullets: [
      'Personal Identification Information: Full legal name, residential and mailing address, email address, telephone number, date of birth, Social Security Number or Tax Identification Number, government-issued identification details, and employment or income information.',
      'Financial Information: Account numbers and balances, transaction history and payment records, credit history and creditworthiness data, loan, mortgage, and investment information, and debit or credit card information.',
      'Technical and Usage Information: IP address, browser type and version, device type and operating system, login activity and session timestamps, pages viewed, and interaction data.',
      'Communication Records: Emails, online messages, recorded telephone calls where permitted by law, customer service inquiries, and support requests.',
    ],
  },
  {
    id: 'how-we-use-your-information',
    title: '2. How We Use Your Information',
    content: [
      'We process your information for legitimate business purposes and in compliance with applicable federal, state, and local laws.',
    ],
    bullets: [
      'Open, maintain, and service your accounts.',
      'Process payments, transfers, and transactions.',
      'Verify your identity and conduct due diligence checks.',
      'Detect, prevent, and investigate fraud or unauthorized activity.',
      'Comply with AML, KYC, and other regulatory requirements.',
      'Provide customer support and respond to inquiries.',
      'Improve, develop, and enhance products and services.',
      'Send service-related communications and legally required notices.',
    ],
  },
  {
    id: 'information-sharing-and-disclosure',
    title: '3. Information Sharing and Disclosure',
    content: ['Orine Credit Bank LTD does not sell or rent your personal information to third parties.'],
    bullets: [
      'With your authorization.',
      'With trusted service providers under confidentiality and data protection obligations.',
      'To comply with legal and regulatory requirements.',
      'To protect rights, safety, and security and prevent fraud.',
      'As part of permitted business transfers such as mergers or acquisitions.',
    ],
  },
  {
    id: 'data-security',
    title: '4. Data Security',
    content: [
      'We maintain administrative, technical, and physical safeguards designed to protect your information against unauthorized access, disclosure, alteration, or destruction.',
    ],
    bullets: [
      'Encryption of sensitive data in transit and at rest.',
      'Multi-factor authentication and secure login protocols.',
      'Role-based access controls and employee confidentiality obligations.',
      'Continuous fraud monitoring and intrusion detection.',
      'Regular internal audits, vulnerability assessments, and security testing.',
    ],
  },
  {
    id: 'your-rights-and-choices',
    title: '5. Your Rights and Choices',
    bullets: [
      'Access and review personal information we maintain about you.',
      'Request correction of inaccurate or incomplete information.',
      'Opt out of certain marketing communications.',
      'Request deletion where permitted by law.',
      'Restrict or object to certain processing activities.',
      'File a complaint with an applicable regulatory authority.',
    ],
  },
  {
    id: 'cookies-and-tracking-technologies',
    title: '6. Cookies and Tracking Technologies',
    bullets: [
      'Maintain secure sessions.',
      'Remember user preferences.',
      'Measure site performance and usage trends.',
      'Detect suspicious or fraudulent activity.',
    ],
  },
  {
    id: 'third-party-websites-and-services',
    title: '7. Third-Party Websites and Services',
    content: [
      'Our Services may include links to external websites or platforms. We do not control and are not responsible for third-party privacy practices.',
    ],
  },
  {
    id: 'childrens-privacy',
    title: "8. Children's Privacy",
    content: [
      'Our Services are not intended for individuals under age 13. We do not knowingly collect personal information from children without verifiable parental consent where required by law.',
    ],
  },
  {
    id: 'data-retention',
    title: '9. Data Retention',
    bullets: [
      'Fulfill the purposes described in this policy.',
      'Comply with legal, regulatory, tax, and accounting obligations.',
      'Resolve disputes and enforce agreements.',
      'Securely delete, anonymize, or archive information when no longer required.',
    ],
  },
  {
    id: 'changes-to-this-policy',
    title: '10. Changes to This Privacy Policy',
    content: [
      'We may update this policy to reflect changes in law, technology, or business practices. Material changes will be posted with an updated Effective Date.',
    ],
  },
];

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="h-4 w-4" />
              Privacy & Security
            </div>
            <h1 className="mt-4 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="mt-4 text-blue-100 max-w-3xl text-sm sm:text-base">
              Effective Date: February 15, 2026
            </p>
            <p className="mt-2 text-blue-100 max-w-3xl text-sm sm:text-base leading-relaxed">
              Orine Credit Bank LTD (&quot;Orine Credit Bank,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting the
              privacy, confidentiality, and security of your personal information. This Privacy Policy explains how
              we collect, use, disclose, safeguard, and retain information when you use our Services.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm break-words">
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <Lock className="h-5 w-5 mt-0.5 shrink-0" />
            <p>
              By using our Services, you acknowledge and agree to the practices described in this Privacy Policy.
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
              </article>
            ))}
          </div>

          <article id="contact-information" className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-700" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">11. Contact Information</h2>
            </div>
            <p className="mt-3 text-slate-700">If you have questions or requests regarding this policy, contact:</p>
            <div className="mt-4 text-slate-800 space-y-1">
              <p className="font-semibold">Privacy Officer</p>
              <p>Orine Credit Bank LTD</p>
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
