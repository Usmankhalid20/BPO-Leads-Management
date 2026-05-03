"use client";

import { useEffect } from "react";

export function JornayaLoader() {
  useEffect(() => {
    const scriptSrc = process.env.NEXT_PUBLIC_JORNAYA_SCRIPT_SRC;
    if (!scriptSrc) {
      console.warn("[Jornaya] NEXT_PUBLIC_JORNAYA_SCRIPT_SRC is not set");
      return;
    }

    if (document.getElementById("LeadiDscript_campaign")) return;

    const script = document.createElement("script");
    script.id = "LeadiDscript_campaign";
    script.type = "text/javascript";
    script.async = true;
    script.src = scriptSrc;
    script.onload = () => window.dispatchEvent(new Event("jornaya:loaded"));
    script.onerror = () => window.dispatchEvent(new Event("jornaya:error"));
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
