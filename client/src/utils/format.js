export function formatCents(cents) {
  if (cents == null) return undefined;
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return undefined;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
