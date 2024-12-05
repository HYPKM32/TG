import axios, { AxiosError } from 'axios';

interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    name: string;
    userId: string;
  };
}

interface ErrorResponse {
  message: string;
}

interface UserData {
  name: string;
  userId: string;
  pwd: string;
}

const client = axios.create({
  baseURL: 'http://210.117.211.26:5000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = async (userData: UserData): Promise<AuthResponse> => {
  try {
    const response = await client.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      throw new Error(axiosError.response.data?.message || '회원가입 실패');
    } else if (axiosError.request) {
      throw new Error('서버에서 응답이 오지 않았습니다.');
    } else {
      throw new Error(`요청 실패: ${axiosError.message}`);
    }
  }
};

export const login = async (userId: string, pwd: string): Promise<AuthResponse> => {
  try {
    const response = await client.post('/auth/login', { userId, pwd });
    
    if (response.data.token && response.data.user) {
      // 토큰과 사용자 정보 저장
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.userId);
      localStorage.setItem('userName', response.data.user.name);
      
      // 이후 요청에 대한 헤더 설정
      client.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      throw new Error(axiosError.response.data?.message || '로그인 실패');
    } else if (axiosError.request) {
      throw new Error('서버에서 응답이 오지 않았습니다.');
    } else {
      throw new Error(`요청 실패: ${axiosError.message}`);
    }
  }
};

export const logout = async (): Promise<AuthResponse> => {
  try {
    const response = await client.post('/auth/logout');
    // 모든 인증 관련 데이터 제거
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    delete client.defaults.headers.common['Authorization'];
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      throw new Error(axiosError.response.data?.message || '로그아웃 실패');
    } else if (axiosError.request) {
      throw new Error('서버에서 응답이 오지 않았습니다.');
    } else {
      throw new Error(`요청 실패: ${axiosError.message}`);
    }
  }
};

// 사용자 인증 상태 확인 함수
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = () => {
  return {
    userId: localStorage.getItem('userId'),
    userName: localStorage.getItem('userName'),
    token: localStorage.getItem('token')
  };
};

// 초기 설정: 저장된 토큰이 있다면 헤더에 설정
const token = localStorage.getItem('token');
if (token) {
  client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const getFridgeInfo = async (fridgeName: string): Promise<any> => {
  try {
    const response = await client.get(`/fridge/${fridgeName}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      throw new Error(`냉장고 정보 조회 실패: ${axiosError.response.data?.message || '알 수 없는 에러'}`);
    } else if (axiosError.request) {
      throw new Error('서버에서 응답이 오지 않았습니다.');
    } else {
      throw new Error(`요청 실패: ${axiosError.message}`);
    }
  }
};

export default client;