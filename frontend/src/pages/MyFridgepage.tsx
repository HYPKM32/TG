import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FolderOpen, RefrigeratorIcon, X } from 'lucide-react';
import { getFridgeInfo, addFridge, getAllFridges } from '../api/client';

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
  const [fridges, setFridges] = useState<Array<{ _id: string; name: string }>>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedFridge, setSelectedFridge] = useState<FridgeInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFridges = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await getAllFridges();
      setFridges(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFridges();
  }, []);

  const handleCreateFridge = async () => {
    try {
      setError(null);
      setLoading(true);
      await addFridge();
      await fetchFridges();
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFridgeClick = async (fridgeName: string) => {
    try {
      setError(null);
      setLoading(true);
      const info = await getFridgeInfo(fridgeName);
      setSelectedFridge(info);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
      setSelectedFridge(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedFridge(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">My Fridge</h1>
          <button
            onClick={handleCreateFridge}
            disabled={loading}
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
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
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={fridges.length === 0 ? "col-span-2" : ""}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : fridges.length === 0 ? (
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
                    key={fridge._id} 
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => handleFridgeClick(fridge.name)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <RefrigeratorIcon className="w-6 h-6 text-blue-500" />
                          <h2 className="text-xl font-semibold text-blue-700">
                            {fridge.name}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedFridge && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-800">
                  {selectedFridge.data.name} 상세정보
                </h2>
                <button
                  onClick={handleCloseDetails}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                {selectedFridge.data.item.length === 0 ? (
                  <p className="text-gray-500">아직 등록된 아이템이 없습니다.</p>
                ) : (
                  selectedFridge.data.item.map((item, index) => (
                    <div key={item._id} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-lg">아이템 {index + 1}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <p className="text-gray-600">음식 종류: {item.foodType || '미지정'}</p>
                        <p className="text-gray-600">이미지: {item.imgPath || '없음'}</p>
                        <p className="text-gray-600">시작일: {item.dayset || '미지정'}</p>
                        <p className="text-gray-600">종료일: {item.dayend || '미지정'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFridgePage;