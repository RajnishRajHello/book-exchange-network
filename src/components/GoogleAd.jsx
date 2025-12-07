import React, { useEffect, useRef } from "react";

export default function GoogleAd({ className, style }) {
  const insRef = useRef(null);

  useEffect(() => {
    // push the ad slot once when component mounts
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // ignore duplicate push errors
      // console.debug("adsbygoogle push error", e);
    }
  }, []);

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7265798690109951"
        data-ad-slot="8134315892"
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={insRef}
      />
    </div>
  );
}
