export default {
  theme: {
    extend: {
      fontFamily: {
        custom: ["SpaceGrotesk", "sans-serif"],
      },
      colors: {
        brand: "#FF8BA1",  
        "made-gray": "#FFFFFF",      // single color → use as bg-brand, text-brand
        primary: {               // or a shade scale
          100: "#FFE5DE",
          500: "#FF5733",
          900: "#7A1A00",
        },
      },
    },
  },
};