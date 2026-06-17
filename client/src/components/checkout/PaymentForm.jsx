const inputClass =
  "w-full bg-[#1A1A1A] rounded-xl border border-neutral-700 text-white text-xs px-4 py-3 placeholder:text-[#737373] outline-none focus:border-[#EF476F] transition-colors";

export default function PaymentForm() {
  return (
    <div className="bg-[#121212] rounded-3xl border border-neutral-900 p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF476F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span className="text-[10px] font-black text-white uppercase tracking-widest">
          SECURE ENCRYPTED CHECKOUT
        </span>
      </div>

      <span className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-3">
        QUICK AUTH
      </span>
      <div className="flex gap-3 mb-6">
        <button className="flex-1 bg-[#1A1A1A] border border-neutral-700 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F8F9FA" strokeWidth="2">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
          </svg>
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">APPLE PAY</span>
        </button>
        <button className="flex-1 bg-[#1A1A1A] border border-neutral-700 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#F8F9FA">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">GOOGLE PAY</span>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-neutral-800" />
        <span className="text-[9px] text-[#737373] uppercase tracking-widest font-bold">OR CARD PAYMENT</span>
        <div className="flex-1 h-px bg-neutral-800" />
      </div>

      <div>
        <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
          CARDHOLDER NAME
        </label>
        <input type="text" placeholder="Tony Alva" className={inputClass} />
      </div>
      <div className="mt-4">
        <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
          CARD NUMBER
        </label>
        <input type="text" placeholder="4000 0000 0000 0000" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
            EXPIRY DATE
          </label>
          <input type="text" placeholder="MM/YY" className={inputClass} />
        </div>
        <div>
          <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
            SECURITY CODE
          </label>
          <input type="text" placeholder="CVV" className={inputClass} />
        </div>
      </div>

      <label className="flex items-center gap-2 mt-4 cursor-pointer">
        <div className="w-4 h-4 rounded border border-neutral-700 bg-[#1A1A1A] flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#EF476F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="text-[10px] text-[#737373] uppercase tracking-wider">
          Save card for future purchases
        </span>
      </label>

      <div className="bg-[#1A1A1A] rounded-2xl p-4 mt-6 border border-neutral-800 flex items-start gap-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A4C93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <div>
          <span className="text-[10px] font-bold text-white uppercase tracking-wider block mb-1">
            ENCRYPTED DATA FLOW
          </span>
          <p className="text-[9px] text-[#737373] leading-relaxed">
            All payment data is encrypted using 256-bit SSL security. Your
            financial information never touches our servers and is processed
            directly through our PCI-compliant gateway.
          </p>
        </div>
      </div>
    </div>
  );
}
