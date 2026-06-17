const reviews = [
  {
    id: "01",
    text: "Took this deck straight to the park and it ripped. The concave locks your feet in like a glove. Best purchase of the year.",
    initials: "RK",
    name: "RAUL K.",
    tag: "STREET VETERAN",
  },
  {
    id: "02",
    text: "I've been skating for 12 years and this is the most responsive board I've ever ridden. The pop is insane.",
    initials: "MS",
    name: "MAYA S.",
    tag: "VERT SPECIALIST",
  },
  {
    id: "03",
    text: "Bought this for my son and he won't stop skating. Quality is unmatched. The graphic finish is still flawless after 3 months.",
    initials: "TL",
    name: "TROY L.",
    tag: "VERIFIED BUYER",
  },
];

export default function CustomerReviews() {
  return (
    <section className="w-full px-8 py-12 border-t border-neutral-900">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            STREET FEEDBACK
          </h2>
          <span className="text-[9px] text-[#737373] uppercase tracking-wider block mt-1">
            AUTHENTIC VERIFIED OWNERS
          </span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="#EF476F"
              stroke="#EF476F"
              strokeWidth="1"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
          <span className="text-xs font-bold text-white ml-2">4.9 / 5.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-[#171717] border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between min-h-[180px]">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-[#737373] font-mono">{review.id}</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="#2DD4BF"
                stroke="#2DD4BF"
                strokeWidth="1"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
        </div>
        <p className="text-xs text-[#F8F9FA] leading-normal mb-6 flex-grow">
          &ldquo;{review.text}&rdquo;
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#282826] flex items-center justify-center text-[10px] font-bold text-white">
          {review.initials}
        </div>
        <div>
          <p className="text-xs font-bold text-white uppercase">{review.name}</p>
          <p className="text-[9px] text-[#737373] uppercase">{review.tag}</p>
        </div>
      </div>
    </div>
  );
}
