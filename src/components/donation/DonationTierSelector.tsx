'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { DONATION_TIERS, MONTHLY_TIERS } from '@/config/donation';

interface Props {
  defaultAmount?: number;
}

export default function DonationTierSelector({ defaultAmount = 1000 }: Props) {
  const [mode, setMode] = useState<'one-time' | 'monthly'>('one-time');
  const [selected, setSelected] = useState<number>(defaultAmount);
  const [custom, setCustom] = useState('');

  const amount = useMemo(() => {
    const parsed = Number(custom);
    return custom && Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : selected;
  }, [custom, selected]);

  const href = useMemo(() => {
    const params = new URLSearchParams();
    params.set('amount', String(amount || 1000));
    if (mode === 'monthly') {
      params.set('recurring', 'true');
      params.set('frequency', 'monthly');
    }
    return `/donate?${params.toString()}`;
  }, [amount, mode]);

  const tiers = mode === 'one-time' ? DONATION_TIERS : null;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xl sm:p-7">
      <div className="mb-5 flex justify-center">
        <div className="inline-flex rounded-full bg-gray-100 p-1" role="tablist" aria-label="Donation frequency">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'one-time'}
            onClick={() => {
              setMode('one-time');
              setSelected(1000);
              setCustom('');
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              mode === 'one-time' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Give once
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'monthly'}
            onClick={() => {
              setMode('monthly');
              setSelected(500);
              setCustom('');
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              mode === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Give monthly
          </button>
        </div>
      </div>

      {tiers ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {tiers.map((tier) => {
            const isActive = !custom && selected === tier.amount;
            return (
              <button
                key={tier.amount}
                type="button"
                onClick={() => {
                  setSelected(tier.amount);
                  setCustom('');
                }}
                aria-pressed={isActive}
                className={`relative rounded-2xl border-2 p-4 text-left transition-all ${
                  isActive
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                }`}
              >
                {tier.tag && (
                  <span className="absolute -top-2 right-3 rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {tier.tag}
                  </span>
                )}
                <span className="block text-2xl font-bold text-gray-900">
                  ₹{tier.amount.toLocaleString('en-IN')}
                </span>
                <span className="mt-1 block text-sm font-semibold text-gray-900">{tier.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-gray-600">{tier.description}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          {MONTHLY_TIERS.map((tier) => {
            const isActive = !custom && selected === tier.amount;
            return (
              <button
                key={tier.amount}
                type="button"
                onClick={() => {
                  setSelected(tier.amount);
                  setCustom('');
                }}
                aria-pressed={isActive}
                className={`rounded-2xl border-2 p-4 text-center transition-all ${
                  isActive
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <span className="block text-xl font-bold text-gray-900">{tier.label}</span>
                <span className="mt-1 block text-xs text-gray-600">{tier.note}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="custom-amount" className="mb-1 block text-sm font-medium text-gray-700">
          Or choose your own amount (₹)
        </label>
        <input
          id="custom-amount"
          type="number"
          inputMode="numeric"
          min={100}
          max={500000}
          value={custom}
          onChange={(event) => setCustom(event.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Enter any amount above ₹100"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        <p className="mt-1 text-xs text-gray-500">
          Minimum ₹100. Every rupee above ₹100 buys stationery, tuition time or data for a classroom.
        </p>
      </div>

      <Link
        href={href}
        className="mt-5 block w-full rounded-xl bg-orange-600 px-6 py-4 text-center text-lg font-bold text-white shadow-lg transition-colors hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200"
      >
        Donate {amount ? `₹${amount.toLocaleString('en-IN')}` : ''}
        {mode === 'monthly' ? ' every month' : ' now'}
      </Link>

      <ul className="mt-4 grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="text-green-600">✓</span>
          UPI, cards, net banking, wallets
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="text-green-600">✓</span>
          80G receipt emailed in 7 working days
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="text-green-600">✓</span>
          PCI-DSS compliant Razorpay checkout
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="text-green-600">✓</span>
          No card details stored on our servers
        </li>
      </ul>
    </div>
  );
}
