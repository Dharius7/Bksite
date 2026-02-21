'use client';

import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface TransferConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  methodLabel: string;
  amount: number;
  balance: number | null;
  sourceLabel?: string;
  fee?: number;
  btcRate?: number | null;
  statusMessage?: string;
  statusError?: string;
}

export default function TransferConfirmModal({
  open,
  onClose,
  onConfirm,
  methodLabel,
  amount,
  balance,
  sourceLabel = 'Account Balance',
  fee = 0,
  btcRate = null,
  statusMessage = '',
  statusError = '',
}: TransferConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('transfer-confirm-open');
    return () => {
      document.body.classList.remove('transfer-confirm-open');
    };
  }, [open]);

  if (!open) return null;

  const totalDeducted = amount + fee;
  const newBalance = balance === null ? null : balance - totalDeducted;
  const btcEquivalent =
    btcRate && amount > 0 ? amount / btcRate : null;

  const formatMoney = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="w-full max-w-[98vw] sm:max-w-lg max-h-[95dvh] overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 bg-white p-3 sm:p-5 border-b border-gray-100 flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-[15px] leading-5 sm:text-lg font-semibold text-gray-900">Confirm Your Transfer</h3>
              <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                Please review your details before confirming. Once submitted, Transaction cannot be reversed.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 text-xs sm:text-sm overflow-y-auto">

          {statusMessage && (
            <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
              {statusMessage}
            </div>
          )}

          {statusError && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {statusError}
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <span className="text-gray-600">Transfer Method</span>
            <span className="font-semibold text-gray-900 text-right break-words">{methodLabel}</span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold text-gray-900">{formatMoney(amount)}</span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <span className="text-gray-600">Source</span>
            <span className="font-semibold text-gray-900 text-right break-words">{sourceLabel}</span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <span className="text-gray-600">Fee</span>
            <span className="font-semibold text-gray-900">{formatMoney(fee)}</span>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <span className="text-gray-600">Total Deducted</span>
              <span className="font-semibold text-gray-900">{formatMoney(totalDeducted)}</span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-gray-600">New Account Balance</span>
              <span className="font-semibold text-gray-900">
                {newBalance === null ? 'N/A' : formatMoney(newBalance)}
              </span>
            </div>

            {btcEquivalent !== null && (
              <div className="flex items-start justify-between gap-3">
                <span className="text-gray-600">BTC Equivalent</span>
                <span className="font-semibold text-gray-900">≈ {btcEquivalent.toFixed(8)} BTC</span>
              </div>
            )}
          </div>

        </div>

        <div className="sticky bottom-0 bg-white p-3 sm:p-5 pt-2 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Confirm Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

