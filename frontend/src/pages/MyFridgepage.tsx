import React, { useState } from 'react';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import { getFridgeInfo } from '../api/client';

// 냉장고 데이터 타입 정의
interface Fridge {
  id: number;
  name: string;
  createdAt: string;
}

// API 응답 타입 정의
interface FridgeItem {
  _id: string;
  foodType: string;
  imgPath: string;
  dayset: string;
  dayend: string;
}

interface FridgeInfo {
  success: boolean;
  data: {
    _id: string;
    name: string;
    item: FridgeItem[];
  };
}

const MyFridgePage = () => {
  const [fridges, setFridges] = useState<Fridge[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedFridge, setSelectedFridge] = useState<FridgeInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateFridge = () => {
    const newFridge: Fridge = {
      id: Date.now(),
      name: `fridge${fridges.length + 1}`,  
      createdAt: new Date().toLocaleDateString()
    };
    setFridges([...fridges, newFridge]);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleDeleteFridge = (id: number) => {
    setFridges(fridges.filter(fridge => fridge.id !== id));
    setSelectedFridge(null);
  };

  const handleFridgeClick = async (fridgeName: string) => {
    try {
      setError(null); // 새로운 요청 시작 시 에러 초기화
      const info = await getFridgeInfo(fridgeName);
      setSelectedFridge(info);
    } catch (error) {
      console.error('냉장고 정보 조회 실패:', error);
      setError('냉장고 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setSelectedFridge(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">My Fridge</h1>
          <button
            onClick={handleCreateFridge}
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            냉장고 만들기
          </button>
        </div>

        {showAlert && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">새로운 냉장고가 추가되었습니다!</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-700 mb-1">오류 발생</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={fridges.length === 0 ? "col-span-2" : ""}>
            {fridges.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8">
                <div className="flex flex-col items-center justify-center py-12">
                  <FolderOpen className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">아직 등록된 냉장고가 없습니다</p>
                  <p className="text-gray-400">상단의 '냉장고 만들기' 버튼을 눌러 새로운 냉장고를 등록해보세요!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fridges.map((fridge) => (
                  <div 
                    key={fridge.id} 
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => handleFridgeClick(fridge.name)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-blue-700">
                          {fridge.name}
                        </h2>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFridge(fridge.id);
                          }}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-500">생성일: {fridge.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 선택된 냉장고 정보 표시 */}
          {selectedFridge && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">{selectedFridge.data.name} 상세정보</h2>
              <div className="space-y-4">
                {selectedFridge.data.item.map((item, index) => (
                  <div key={item._id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg">아이템 {index + 1}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <p className="text-gray-600">음식 종류: {item.foodType || '미지정'}</p>
                      <p className="text-gray-600">이미지: {item.imgPath || '없음'}</p>
                      <p className="text-gray-600">시작일: {item.dayset || '미지정'}</p>
                      <p className="text-gray-600">종료일: {item.dayend || '미지정'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFridgePage;