type IpWhoIsResponse = {
  ip?: string;
  country?: string;
  regionName?: string;
  city?: string;
  postal?: string;
  isp?: string;
  timezone?: string;
  status?: "success" | "fail";
};

export type GeoDetails = {
  country?: string | null;
  city?: string | null;
  state_province?: string | null;
  zipcode?: string | null;
  isp?: string | null;
  timezone?: string | null;
};

export async function enrichIpAddress(ip: string) {
  if (!ip || ip === "unknown") {
    return { ip_address: ip, ip_geo_raw: null, ...emptyGeoDetails() };
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}`, { cache: "no-store" });
    if (!response.ok) {
      return { ip_address: ip, ip_geo_raw: null, ...emptyGeoDetails() };
    }

    const data = (await response.json()) as IpWhoIsResponse;
    if (data.status && data.status !== "success") {
      return { ip_address: ip, ip_geo_raw: data, ...emptyGeoDetails() };
    }

    return {
      ip_address: data.ip || ip,
      ip_geo_raw: data,
      country: data.country || null,
      city: data.city || null,
      state_province: data.regionName || null,
      zipcode: data.postal || null,
      isp: data.isp || null,
      timezone: data.timezone || null
    };
  } catch {
    return { ip_address: ip, ip_geo_raw: null, ...emptyGeoDetails() };
  }
}

function emptyGeoDetails(): GeoDetails {
  return {
    country: null,
    city: null,
    state_province: null,
    zipcode: null,
    isp: null,
    timezone: null
  };
}
