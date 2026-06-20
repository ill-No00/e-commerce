import { useState } from "react";
import { Plus, Edit2, Trash2, CreditCard, MapPin } from "lucide-react";

const tabs = ["PROFILE", "PASSWORD_&_SECURITY", "ADDRESSES", "NOTIFICATIONS", "PAYMENT_METHODS"];

const notificationGroups = {
  "ORDER_UPDATES": [
    { label: "Shipping updates", desc: "When your order ships" },
    { label: "Delivery alerts", desc: "When your order is delivered" },
    { label: "Processing status", desc: "When your order status changes" },
  ],
  "CREW_&_REWARDS": [
    { label: "Point milestones", desc: "When you earn a reward milestone" },
    { label: "Tier upgrades", desc: "When your crew tier changes" },
    { label: "Referral activity", desc: "When someone joins via your link" },
  ],
  "MARKETING": [
    { label: "New drops", desc: "When new products launch" },
    { label: "Promotions", desc: "Exclusive deals and offers" },
    { label: "Newsletter", desc: "Weekly crew newsletter" },
  ],
};

const savedAddresses = [
  { label: "HOME", address: "456 Oak St, Los Angeles, CA 90013", default: true },
  { label: "WORK", address: "789 Sunset Blvd, Ste 200, Los Angeles, CA 90028", default: false },
];

const savedCards = [
  { brand: "VISA", last4: "4242", expiry: "06/27", default: true },
  { brand: "MASTERCARD", last4: "8888", expiry: "12/28", default: false },
];

function Toggle({ on }) {
  return (
    <div className={`w-9 md:w-10 h-[18px] md:h-5 rounded-full p-0.5 cursor-pointer transition-colors shrink-0 ${on ? "bg-[#ff2d78]" : "bg-[#2a2a2a]"}`}>
      <div className={`w-3.5 md:w-4 h-3.5 md:h-4 rounded-full bg-white transition-transform ${on ? "translate-x-4 md:translate-x-5" : ""}`} />
    </div>
  );
}

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">SETTINGS</h1>
        <p className="text-[11px] text-[#888] mt-1">Manage your profile, passwords, addresses, and preferences.</p>
      </div>

      <div className="flex gap-1.5 md:gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all ${
              i === activeTab
                ? "bg-[#ff2d78] text-white"
                : "bg-[#1a1a1a] text-[#888] border border-[#2a2a2a] hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 md:p-6">
          <div className="flex flex-col xs:flex-row items-center xs:items-start gap-4 mb-6 pb-6 border-b border-[#2a2a2a] text-center xs:text-left">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#2a2a2a] ring-2 ring-[#ff2d78] shrink-0" />
            <div>
              <div className="text-sm md:text-base font-black text-white uppercase">ALEX_RIDER</div>
              <button className="text-[9px] font-bold text-[#ff2d78] uppercase tracking-widest hover:underline">CHANGE_PHOTO</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
            <div>
              <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-1.5 md:mb-2">DISPLAY_NAME</label>
              <input defaultValue="Alex Rider" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-3 md:px-4 py-2.5 md:py-3 outline-none" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-1.5 md:mb-2">USERNAME</label>
              <input defaultValue="@alexrider" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-3 md:px-4 py-2.5 md:py-3 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            <div>
              <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-1.5 md:mb-2">EMAIL</label>
              <input defaultValue="alex@4wheels.com" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-3 md:px-4 py-2.5 md:py-3 outline-none" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-1.5 md:mb-2">STANCE</label>
              <select className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-3 md:px-4 py-2.5 md:py-3 outline-none">
                <option>GOOFY</option>
                <option>REGULAR</option>
              </select>
            </div>
          </div>
          <div className="mb-4 md:mb-6">
            <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-1.5 md:mb-2">HOME_SPOT</label>
            <input defaultValue="East Side Plaza" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-3 md:px-4 py-2.5 md:py-3 outline-none" />
          </div>
          <div className="text-right">
            <button className="bg-[#ff2d78] text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:brightness-110 transition-all">
              SAVE_CHANGES
            </button>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            <div>
              <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-1.5 md:mb-2">CURRENT_PASSWORD</label>
              <input type="password" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-3 md:px-4 py-2.5 md:py-3 outline-none" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-1.5 md:mb-2">NEW_PASSWORD</label>
              <input type="password" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-3 md:px-4 py-2.5 md:py-3 outline-none" />
            </div>
          </div>
          <div className="mb-4 md:mb-6">
            <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-1.5 md:mb-2">CONFIRM_PASSWORD</label>
            <input type="password" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-3 md:px-4 py-2.5 md:py-3 outline-none max-w-xs" />
          </div>
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#2a2a2a] gap-3">
            <div className="min-w-0">
              <div className="text-[11px] md:text-xs font-bold text-white">TWO_FACTOR_AUTH</div>
              <div className="text-[9px] text-[#888] mt-0.5">Extra layer of security for your account</div>
            </div>
            <Toggle on={false} />
          </div>
          <div className="text-right">
            <button className="bg-[#ff2d78] text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:brightness-110 transition-all">
              UPDATE_PASSWORD
            </button>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            {savedAddresses.map((addr) => (
              <div key={addr.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 md:p-5">
                <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
                  <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                    <MapPin size={13} className="md:hidden text-[#ff2d78] shrink-0" />
                    <MapPin size={14} className="hidden md:block text-[#ff2d78] shrink-0" />
                    <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-wider">{addr.label}</span>
                    {addr.default && (
                      <span className="text-[7px] md:text-[8px] font-bold text-[#22c55e] bg-[#22c55e]/10 rounded-full px-1.5 md:px-2 py-0.5 uppercase tracking-wider shrink-0">DEFAULT</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                    <button className="text-[#888] hover:text-white transition-colors"><Edit2 size={12} className="md:hidden" /><Edit2 size={13} className="hidden md:block" /></button>
                    <button className="text-[#888] hover:text-[#ef4444] transition-colors"><Trash2 size={12} className="md:hidden" /><Trash2 size={13} className="hidden md:block" /></button>
                  </div>
                </div>
                <div className="text-[10px] md:text-[11px] text-[#ccc] leading-relaxed">{addr.address}</div>
              </div>
            ))}
          </div>
          <button className="w-full bg-[#141414] border-2 border-dashed border-[#2a2a2a] rounded-xl p-4 md:p-5 text-center hover:border-[#ff2d78]/40 transition-all group">
            <Plus size={18} className="md:hidden mx-auto mb-1 text-[#888] group-hover:text-[#ff2d78] transition-colors" />
            <Plus size={20} className="hidden md:block mx-auto mb-1 text-[#888] group-hover:text-[#ff2d78] transition-colors" />
            <span className="text-[9px] md:text-[10px] font-bold text-[#888] uppercase tracking-widest group-hover:text-[#ff2d78] transition-colors">
              ADD_NEW_ADDRESS
            </span>
          </button>
        </div>
      )}

      {activeTab === 3 && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 md:p-6">
          {Object.entries(notificationGroups).map(([group, items]) => (
            <div key={group} className="mb-5 md:mb-6 last:mb-0">
              <div className="text-[9px] md:text-[10px] font-bold text-[#ff2d78] uppercase tracking-widest mb-2 md:mb-3">{group}</div>
              <div className="flex flex-col gap-2 md:gap-3">
                {items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between bg-[#141414] rounded-lg px-3 md:px-4 py-2.5 md:py-3 border border-[#2a2a2a] gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] md:text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[8px] md:text-[9px] text-[#888] mt-0.5">{item.desc}</div>
                    </div>
                    <Toggle on={true} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 4 && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            {savedCards.map((card, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 md:p-5">
                <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <CreditCard size={16} className="md:hidden text-[#888] shrink-0" />
                    <CreditCard size={18} className="hidden md:block text-[#888] shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[11px] md:text-xs font-black text-white">{card.brand}</span>
                        {card.default && (
                          <span className="text-[7px] md:text-[8px] font-bold text-[#22c55e] bg-[#22c55e]/10 rounded-full px-1.5 md:px-2 py-0.5 uppercase tracking-wider shrink-0">DEFAULT</span>
                        )}
                      </div>
                      <div className="text-[10px] md:text-[11px] text-[#888] mt-0.5">&bull;&bull;&bull;&bull; {card.last4} &middot; {card.expiry}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                    <button className="text-[#888] hover:text-white transition-colors"><Edit2 size={12} className="md:hidden" /><Edit2 size={13} className="hidden md:block" /></button>
                    <button className="text-[#888] hover:text-[#ef4444] transition-colors"><Trash2 size={12} className="md:hidden" /><Trash2 size={13} className="hidden md:block" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full bg-[#141414] border-2 border-dashed border-[#2a2a2a] rounded-xl p-4 md:p-5 text-center hover:border-[#ff2d78]/40 transition-all group">
            <Plus size={18} className="md:hidden mx-auto mb-1 text-[#888] group-hover:text-[#ff2d78] transition-colors" />
            <Plus size={20} className="hidden md:block mx-auto mb-1 text-[#888] group-hover:text-[#ff2d78] transition-colors" />
            <span className="text-[9px] md:text-[10px] font-bold text-[#888] uppercase tracking-widest group-hover:text-[#ff2d78] transition-colors">
              ADD_PAYMENT_METHOD
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
