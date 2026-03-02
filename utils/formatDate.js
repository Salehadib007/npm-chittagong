export function formatDate(date) {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = String(d.getFullYear());

  return `${day}-${month}-${year}`;
}
