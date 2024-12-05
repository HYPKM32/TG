import React, { useState, useEffect } from 'react';
import { login, register } from '../api/client';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      onLogin();
    }
  }, [onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      if (isLogin) {
        await login(id, password);
        localStorage.setItem('userId', id);
        onLogin();
      } else {
        // 회원가입 처리
        await register({
          userId: id,
          pwd: password,
          name: name
        });
        // 회원가입 성공 메시지 표시
        setSuccessMessage('회원가입이 완료되었습니다!');
        // 3초 후에 로그인 폼으로 전환
        setTimeout(() => {
          setSuccessMessage('');
          setIsLogin(true);
          setId('');
          setPassword('');
          setName('');
        }, 3000);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-blue-800 text-center">
          {isLogin ? '로그인' : '회원가입'}
        </h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-600 rounded-lg text-sm text-center">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          )}
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccessMessage('');
              setId('');
              setPassword('');
              setName('');
            }}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            {isLogin ? '회원가입하기' : '로그인하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;