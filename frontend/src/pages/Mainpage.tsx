import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Refrigerator, Camera, Calendar, BookOpen } from 'lucide-react';
import { calendardayend } from '../api/client';
import Auth from '../components/Auth';

interface ExpiryItem {
  fridgeName: string;
  foodType: string;
  dayend: string;
}

const MainPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [expiringItems, setExpiringItems] = useState<ExpiryItem[]>([]);
  const userName = localStorage.getItem('userName');

  const checkExpiry = async () => {
    try {
      const response = await calendardayend();
      if (response.success) {
        const today = new Date();
        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(today.getDate() + 3);
        
        const soonExpiring = response.data.filter((item: ExpiryItem) => {
          const [year, month, day] = item.dayend.split('_').map(Number);
          const expiryDate = new Date(year, month - 1, day);
          return expiryDate <= threeDaysFromNow && expiryDate >= today;
        });

        if (soonExpiring.length > 0) {
          setExpiringItems(soonExpiring);
          setShowNotification(true);
        }
      }
    } catch (error) {
      console.error('유통기한 체크 중 오류 발생:', error);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    if (isLoggedIn) {
      checkExpiry();
    }
  }, [isLoggedIn]);

  const Notification = () => {
    if (!showNotification) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '300px',
          zIndex: 1000
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
            유통기한 임박 알림
          </h3>
          <button
            onClick={() => setShowNotification(false)}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ fontSize: '14px' }}>
          {expiringItems.map((item, index) => {
            const [year, month, day] = item.dayend.split('_').map(Number);
            const expiryDate = new Date(year, month - 1, day);
            const today = new Date();
            const diffTime = expiryDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return (
              <div
                key={index}
                style={{
                  padding: '8px 0',
                  borderBottom: index < expiringItems.length - 1 ? '1px solid #e5e5e5' : 'none'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {item.fridgeName}
                </div>
                <div>
                  {item.foodType}의 유통기한이 {diffDays === 0 ? '오늘' : `${diffDays}일 후에`} 만료됩니다.
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="text-center bg-gradient-to-b from-blue-50 to-white min-h-screen p-8">
      {isLoggedIn && <Notification />}
      {!isLoggedIn && <Auth onLogin={handleLoginSuccess} />}
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-blue-600">Fresh Buddy</h1>
        <p className="text-lg mb-4 text-gray-600">냉장고 속 신선함을 지키는 당신의 똑똑한 친구</p>
        {userName && (
          <p className="text-xl mb-8 text-blue-600">안녕하세요 {userName}님!</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 border-2 border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <Refrigerator className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">My Fridge</h2>
            <p className="mb-6 text-gray-600 h-24">
              스마트한 냉장고 관리로 식재료를 신선하게 보관하세요.
              유통기한 알림과 재고 현황을 한눈에 확인할 수 있습니다.
            </p>
            <Link to="/fridge" 
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300">
              냉장고 열기 →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 border-2 border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <Camera className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Snap Food</h2>
            <p className="mb-6 text-gray-600 h-24">
              식재료 사진 한 장으로 간편하게 등록하세요.
              AI가 자동으로 식재료를 인식하고 정보를 추가합니다.
            </p>
            <Link to="/snap" 
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300">
              사진 찍기 →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 border-2 border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Calendar</h2>
            <p className="mb-6 text-gray-600 h-24">
              유통기한 캘린더로 식재료를 체계적으로 관리하세요.
              캘린더를 통해 식재료 관리를 더 계획적으로!
            </p>
            <Link to="/calendar" 
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300">
              캘린더 보기 →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 border-2 border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Information</h2>
            <p className="mb-6 text-gray-600 h-24">
              식재료 보관 방법부터 활용 레시피까지,
              신선한 식재료 관리에 필요한 모든 정보를 제공합니다.
            </p>
            <Link to="/info" 
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300">
              정보 보기 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;