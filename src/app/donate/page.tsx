import Link from 'next/link';
import DonationForm from '@/components/forms/DonationForm';
import DonationTierSelector from '@/components/donation/DonationTierSelector';
import { DONATION_TIERS, DONATION_FAQS as FAQS, TRUST_POINTS, HOW_TO_DONATE, FUND_ALLOCATION } from '@/config/donation';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { StructuredData } from '@/components/seo/StructuredData';
import {
  generateDonationStructuredData,
  generateFAQStructuredData,
  generateDonationHowToStructuredData,
} from '@/lib/structured-data';

export const metadata = pageMetadata.donate();

interface DonatePageProps {
  searchParams?: Promise<{ amount?: string; recurring?: string }> | { amount?: string; recurring?: string };
}

export default async function DonatePage({ searchParams }: DonatePageProps = {}) {
  const resolved = searchParams ? await searchParams : undefined;
  const amountParam = Number(resolved?.amount);
  const initialAmount = Number.isFinite(amountParam) && amountParam >= 100 ? amountParam : undefined;
  const initialRecurring = resolved?.recurring === 'true';

  return (
    <>
      <StructuredData data={generateDonationStructuredData()} />
      <StructuredData data={generateFAQStructuredData(FAQS)} />
      <StructuredData data={generateDonationHowToStructuredData(HOW_TO_DONATE)} />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Hero + donation widget */}
        <section className="px-3 pb-10 pt-6 sm:px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { name: 'Home', url: '/' },
                { name: 'Donate Now', url: '/donate' },
              ]}
              className="mx-auto mb-6 max-w-5xl"
            />

            <div className="grid items-start gap-10 lg:grid-cols-2">
              <div className="lg:sticky lg:top-24">
                <p className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1 text-xs font-bold uppercase tracking-wide text-orange-800">
                  Donate now
                </p>
                <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                  ₹500 puts a school kit in a child&apos;s hands today
                </h1>
                <p className="mt-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                  Sunrise Children Educational Society runs free education, school kits and digital
                  learning for underprivileged children in Mehrauli, New Delhi. Your donation pays for
                  the notebooks, the tuition and the data that keep a child in school instead of out of
                  it. Every rupee is spent within Delhi NCR and reported in our annual accounts.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {TRUST_POINTS.map((point) => (
                    <div key={point.label} className="rounded-xl border border-orange-100 bg-white/80 p-3">
                      <p className="flex items-start gap-2 text-sm font-semibold text-gray-900">
                        <span aria-hidden="true" className="text-green-600">✓</span>
                        {point.label}
                      </p>
                      <p className="mt-1 pl-5 text-xs text-gray-600">{point.detail}</p>
                    </div>
                  ))}
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <dt className="sr-only">Children supported</dt>
                    <dd className="text-xl font-bold text-orange-700">2,500+</dd>
                    <p className="text-xs text-gray-600">Children supported</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <dt className="sr-only">Schools reached</dt>
                    <dd className="text-xl font-bold text-orange-700">45</dd>
                    <p className="text-xs text-gray-600">Schools reached</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <dt className="sr-only">Volunteers</dt>
                    <dd className="text-xl font-bold text-orange-700">150+</dd>
                    <p className="text-xs text-gray-600">Active volunteers</p>
                  </div>
                </dl>

                <p className="mt-6 text-sm text-gray-600">
                  Prefer to talk first? Call{' '}
                  <a href="tel:+919953665620" className="font-semibold text-orange-700 underline">
                    099536 65620
                  </a>{' '}
                  or email{' '}
                  <a href="mailto:info@scesindia.com" className="font-semibold text-orange-700 underline">
                    info@scesindia.com
                  </a>
                  .
                </p>
              </div>

              <div>
                <DonationTierSelector defaultAmount={initialAmount ?? 1000} />
              </div>
            </div>
          </div>
        </section>

        {/* Where the money goes */}
        <section className="bg-white px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
              Where your donation goes
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-gray-700">
              We publish how every rupee is split. No donation is spent on anything outside the education
              of underprivileged children in Delhi.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FUND_ALLOCATION.map((slice) => (
                <div key={slice.label} className="rounded-2xl border border-gray-200 p-5 text-center">
                  <p className="text-3xl font-bold text-orange-700">{slice.pct}%</p>
                  <p className="mt-1 font-semibold text-gray-900">{slice.label}</p>
                  <p className="mt-1 text-sm text-gray-600">{slice.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-gray-50 p-6">
              <h3 className="font-bold text-gray-900">What each amount buys</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="px-4 py-3 font-semibold">Amount</th>
                      <th className="px-4 py-3 font-semibold">What it pays for</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DONATION_TIERS.map((tier, index) => (
                      <tr key={tier.amount} className={index % 2 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900">
                          ₹{tier.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                          <span className="font-medium text-gray-900">{tier.title}. </span>
                          {tier.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Donation form */}
        <section id="donate-form" className="px-3 py-14 sm:px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
              Donate now in three steps
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-gray-700">
              Takes about three minutes. UPI is the fastest option, and you can request an 80G certificate
              before you pay.
            </p>

            <div className="mx-auto mb-10 grid max-w-4xl gap-4 sm:grid-cols-3">
              {HOW_TO_DONATE.map((step, index) => (
                <div key={step.name} className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                    {index + 1}
                  </p>
                  <p className="font-semibold text-gray-900">{step.name}</p>
                  <p className="mt-1 text-sm text-gray-600">{step.text}</p>
                </div>
              ))}
            </div>

            <DonationForm defaultAmount={initialAmount} defaultRecurring={initialRecurring || undefined} />
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white px-4 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
              Questions donors ask before giving
            </h2>

            <div className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-200">
              {FAQS.map((faq) => (
                <details key={faq.question} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-900">
                    {faq.question}
                    <span aria-hidden="true" className="ml-4 text-orange-600 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-gray-700">{faq.answer}</p>
                </details>
              ))}
            </div>

            <div className="mt-10 rounded-2xl bg-orange-50 p-6 text-center">
              <h3 className="text-lg font-bold text-gray-900">
                Prefer to read before you give?
              </h3>
              <p className="mt-2 text-gray-700">
                Our guide explains every step of donating online and what your money makes possible.
              </p>
              <Link
                href="/blog/how-to-donate-online-india-why-donate-education"
                className="mt-4 inline-block rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700"
              >
                Read the complete donation guide
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
