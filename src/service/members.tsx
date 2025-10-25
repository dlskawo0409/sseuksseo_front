// src/services/members.ts
import { http } from "@/lib/http";

export interface MemberPayload {
  koreanName: string;
  englishName: string;
  hanjaName: string;
  gender: string;
  birthDay: string;
  addressNum: string;
  address: string;
  addressDetail: string;
  email: string;
  phoneNum: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface MemberResponse {
  memberId: number;
}

const BASE = "/members";

export const MembersApi = {
  // HttpOnly 쿠키 세션을 사용하는 경우 → withCredentials: true
  create: (payload: MemberPayload) =>
    http.post<ApiResponse<MemberResponse>, MemberPayload>(`${BASE}`, payload, {
      withCredentials: true, // 쿠키 전략일 때
      // bearerToken: myToken, // Bearer 전략이면 여기로
    }),

  getMe: () =>
    http.get<ApiResponse<any>>(`${BASE}/me`, {
      withCredentials: true,
    }),
};
