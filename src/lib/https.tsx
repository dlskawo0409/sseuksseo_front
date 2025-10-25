type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions<TBody = unknown> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: TBody;
  headers?: Record<string, string>;
  /** HttpOnly 쿠키 사용 시 true로 (백엔드에서 SameSite, Secure 설정 필요) */
  withCredentials?: boolean;
  /** Bearer 토큰을 헤더로 보낼 때 */
  bearerToken?: string | null;
  /** ms 단위 타임아웃 (기본 15초) */
  timeoutMs?: number;
}

export interface ApiErrorPayload {
  status: number;
  code?: string;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.status = payload.status;
    this.code = payload.code;
    this.details = payload.details;
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function buildQuery(params?: RequestOptions["params"]) {
  if (!params) return "";
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function request<TResp = unknown, TBody = unknown>(
  method: HttpMethod,
  url: string,
  opt: RequestOptions<TBody> = {}
): Promise<TResp> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opt.timeoutMs ?? 15000);

  const headers: Record<string, string> = {
    ...(opt.headers || {}),
  };

  // body 타입에 따라 Content-Type 자동 세팅
  let body: BodyInit | undefined = undefined;
  if (opt.body instanceof FormData) {
    body = opt.body; // 브라우저가 자동으로 Content-Type 설정
  } else if (opt.body !== undefined && method !== "GET") {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
    body = JSON.stringify(opt.body);
  }

  // Bearer 토큰 헤더 (로컬/메모리 토큰을 쓰는 경우)
  if (opt.bearerToken) {
    headers["Authorization"] = `Bearer ${opt.bearerToken}`;
  }

  // 쿠키 전송 (HttpOnly 쿠키 기반 세션/리프레시 전략일 때)
  const credentials = opt.withCredentials ? "include" : "same-origin";

  const fullUrl = `${BASE_URL}${url}${buildQuery(opt.params)}`;

  try {
    const res = await fetch(fullUrl, {
      method,
      headers,
      body,
      credentials,
      signal: controller.signal,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!res.ok) {
      // 오류 응답 파싱
      let errPayload: ApiErrorPayload = {
        status: res.status,
        message: res.statusText || "Request failed",
      };
      if (isJson) {
        const j = await res.json().catch(() => null);
        if (j) {
          errPayload = {
            status: res.status,
            code: j.code ?? undefined,
            message: j.message ?? errPayload.message,
            details: j.details ?? undefined,
          };
        }
      } else {
        const t = await res.text().catch(() => "");
        if (t) errPayload.message = t;
      }
      throw new ApiError(errPayload);
    }

    if (method === "DELETE" || res.status === 204) {
      // no content
      return undefined as TResp;
    }

    if (isJson) {
      return (await res.json()) as TResp;
    }
    // 파일/텍스트 등 필요한 타입에 맞게 확장
    return (await res.text()) as unknown as TResp;
  } catch (e: any) {
    if (e.name === "AbortError") {
      throw new ApiError({ status: 0, message: "Request timeout" });
    }
    if (e instanceof ApiError) throw e;
    throw new ApiError({ status: 0, message: e?.message || "Network error" });
  } finally {
    clearTimeout(timeout);
  }
}

// 편의 메서드
export const http = {
  get: <T = unknown,>(url: string, opt?: RequestOptions) => request<T>("GET", url, opt),
  post: <T = unknown, B = unknown>(url: string, body?: B, opt?: RequestOptions<B>) =>
    request<T, B>("POST", url, { ...opt, body }),
  put: <T = unknown, B = unknown>(url: string, body?: B, opt?: RequestOptions<B>) =>
    request<T, B>("PUT", url, { ...opt, body }),
  patch: <T = unknown, B = unknown>(url: string, body?: B, opt?: RequestOptions<B>) =>
    request<T, B>("PATCH", url, { ...opt, body }),
  delete: <T = unknown,>(url: string, opt?: RequestOptions) => request<T>("DELETE", url, opt),
};
