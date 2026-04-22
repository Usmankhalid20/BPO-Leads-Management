type RequestLike = {
  headers?: Headers;
  ip?: string;
  socket?: { remoteAddress?: string };
  connection?: { remoteAddress?: string };
};

export function getRequestIP(source: Headers | Request | RequestLike): string {
  const headers = source instanceof Request ? source.headers : source instanceof Headers ? source : source.headers ?? new Headers();
  const requestLike = source as RequestLike;
  const directIp = normalizeIp(requestLike.ip, true);
  if (directIp) {
    return directIp;
  }

  const forwarded =
    headers.get("x-forwarded-for") ||
    headers.get("x-vercel-forwarded-for") ||
    headers.get("x-real-ip") ||
    headers.get("x-client-ip") ||
    headers.get("cf-connecting-ip") ||
    headers.get("true-client-ip") ||
    headers.get("fastly-client-ip") ||
    headers.get("x-cluster-client-ip") ||
    headers.get("x-appengine-user-ip");
  if (forwarded) {
    const candidate = forwarded.split(",")[0].trim();
    const normalized = normalizeIp(candidate, true);
    if (normalized) return normalized;
  }
  const forwardedHeader = headers.get("forwarded");
  if (forwardedHeader) {
    const match = forwardedHeader.match(/for="?([^;,""]+)/i);
    if (match?.[1]) {
      const normalized = normalizeIp(match[1].trim().replace(/^\[|\]$/g, ""), true);
      if (normalized) return normalized;
    }
  }
  const rawSource = source as RequestLike;
  return normalizeIp(rawSource.socket?.remoteAddress || rawSource.connection?.remoteAddress, true) || "unknown";
}

export function getUserAgent(source: Headers | Request | { headers?: Headers }) {
  const headers = source instanceof Request ? source.headers : source instanceof Headers ? source : source.headers ?? new Headers();
  return headers.get("user-agent") || "unknown";
}

function normalizeIp(ip?: string | null, keepLoopback = false) {
  if (!ip) return "";
  const cleaned = ip.trim().replace(/^\[|\]$/g, "");
  if (!cleaned || cleaned === "unknown") {
    return "";
  }
  if (!keepLoopback && (cleaned === "127.0.0.1" || cleaned === "::1")) {
    return "";
  }
  return cleaned.startsWith("::ffff:") ? cleaned.slice(7) : cleaned;
}
