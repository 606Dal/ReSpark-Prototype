export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function productStatusLabel(status: string) {
  switch (status) {
    case "ON_SALE":
      return "On sale";
    case "RESERVED":
      return "Reserved";
    case "SOLD":
      return "Sold";
    default:
      return status;
  }
}

export function tradeStatusLabel(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "In progress";
    case "CONFIRMED":
      return "Confirmed";
    case "CANCELED":
      return "Canceled";
    default:
      return status;
  }
}
