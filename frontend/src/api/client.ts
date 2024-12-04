import axios, { AxiosError } from 'axios';

// 에러 응답 타입 정의
interface ErrorResponse {
  message: string;
}

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getFridgeInfo = async (fridgeName: string): Promise<any> => {
  try {
    const response = await client.get(`/fridge/${fridgeName}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      // 서버에서 응답이 왔지만 에러인 경우
      throw new Error(`냉장고 정보 조회 실패: ${axiosError.response.data?.message || '알 수 없는 에러'}`);
    } else if (axiosError.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      throw new Error('서버에서 응답이 오지 않았습니다.');
    } else {
      // 요청 자체를 보내지 못한 경우
      throw new Error(`요청 실패: ${axiosError.message}`);
    }
  }
};

export default client;