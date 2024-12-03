import { Link } from 'react-router-dom';
import { Refrigerator, Camera, Calendar, BookOpen } from 'lucide-react'; // 아이콘 사용

const MainPage = () => {
  return (
    <div className="text-center bg-gradient-to-b from-blue-50 to-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-blue-600">Fresh Buddy</h1>
        <p className="text-lg mb-12 text-gray-600">냉장고 속 신선함을 지키는 당신의 똑똑한 친구</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 냉장고 관리 */}
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

          {/* 사진 촬영 */}
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

          {/* 캘린더 */}
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

          {/* 정보 */}
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