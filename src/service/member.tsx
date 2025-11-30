import { http } from "@/lib/https";

export interface MemberRequestPayload {
  memberCreateRequest: {
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
  };
  disabilityCreateRequest: {
    disabilityType?: string; // optional
    disabilityLevel?: "심한 장애인" | "심하지 않은 장애인" | ""; // 기존 enum 대응
  };
  veteranCreateRequest: {
    veteranNo?: string;
    veteranRatio: 0 | 5 | 10;
  };
  militaryCreateRequest: {
    status?: string;
    serviceType?: string;
    branch?: string;
    rank?: string;
    militaryStartDate?: string;
    militaryEndDate?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface MemberResponse {
  memberId: number;
}

export const MemberBundleApi = {
  saveAll: async (payload: MemberRequestPayload, options?: { withCredentials?: boolean }) => {
    return http.post<ApiResponse<MemberResponse>>("api/v1/members/init", payload, options);
  },
};
