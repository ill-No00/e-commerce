const inputClass =
  "w-full bg-[#1A1A1A] rounded-xl border border-neutral-700 text-white text-xs px-4 py-3 placeholder:text-[#737373] outline-none focus:border-[#EF476F] transition-colors";

export default function ShippingForm({ form = {}, onChange }) {
  const handleChange = (field, value) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
        SHIPPING{" "}
        <span className="text-[#EF476F]">DETAILS</span>
      </h1>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div>
          <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
            FIRST NAME
          </label>
          <input
            type="text"
            placeholder="Tony"
            className={inputClass}
            value={form.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
            LAST NAME
          </label>
          <input
            type="text"
            placeholder="Alva"
            className={inputClass}
            value={form.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
          STREET ADDRESS
        </label>
        <input
          type="text"
          placeholder="1234 Venice Blvd"
          className={inputClass}
          value={form.street || ""}
          onChange={(e) => handleChange("street", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
            CITY
          </label>
          <input
            type="text"
            placeholder="Los Angeles"
            className={inputClass}
            value={form.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
            STATE
          </label>
          <select
            className={`${inputClass} appearance-none`}
            value={form.state || ""}
            onChange={(e) => handleChange("state", e.target.value)}
          >
            <option value="" disabled className="text-[#737373]">
              SELECT
            </option>
            <option value="CA">CA</option>
            <option value="NY">NY</option>
            <option value="TX">TX</option>
            <option value="FL">FL</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
            ZIP CODE
          </label>
          <input
            type="text"
            placeholder="90210"
            className={inputClass}
            value={form.zip || ""}
            onChange={(e) => handleChange("zip", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
