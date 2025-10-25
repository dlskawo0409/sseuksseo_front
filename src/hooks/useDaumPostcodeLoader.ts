import { useEffect, useState } from "react";

const POSTCODE_SRC = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

export function useDaumPostcodeLoader() {
  const [ready, setReady] = useState<boolean>(!!window.daum?.Postcode);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (window.daum?.Postcode) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = POSTCODE_SRC;
    script.async = true;
    script.onload = () => setReady(true);
    script.onerror = () => setError(new Error("Daum Postcode 스크립트 로드 실패"));
    document.head.appendChild(script);

    return () => {
      // cleanup은 불필요하지만, 원하면 제거 가능
    };
  }, []);

  return { ready, error };
}
