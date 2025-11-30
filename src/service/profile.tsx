// api/profile.ts
import { http } from "@/lib/https";

export const ProfileApi = {
  // 사진 업로드 (PATCH, multipart/form-data)
  async uploadProfileImage(image: File | Blob) {
    const fd = new FormData();
    fd.append("image", image); // @RequestPart("image")와 동일 키!

    // Axios는 FormData 주면 Content-Type 자동 설정
    const res = await http.patch("api/v1/members/profile-image", fd, { withCredentials: true });
    console.log(res);
    return res.data; // 현재 백엔드가 body 없이 200 OK라면 undefined일 수 있음
  },
};
