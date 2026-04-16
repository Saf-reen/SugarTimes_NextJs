// Unwrap whatever an API endpoint returns into a plain list.
// Handles: arrays, {items}, {data}, {results}, {users}, {subscriptions},
// {payments}, {enquiries}, {articles}, or any object whose first
// array-typed value is the list we want. Also JSON-parses strings.
export function unwrapList(raw) {
  if (raw == null) return [];
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "object") return [];

  const preferredKeys = [
    "items",
    "data",
    "results",
    "list",
    "rows",
    "users",
    "subscriptions",
    "payments",
    "enquiries",
    "articles",
    "advertisements",
    "magazines",
    "videos",
    "markets",
  ];
  for (const key of preferredKeys) {
    if (Array.isArray(raw[key])) return raw[key];
  }
  // Last-resort: pick the first array-valued field on the object.
  for (const value of Object.values(raw)) {
    if (Array.isArray(value)) return value;
  }
  return [];
}
