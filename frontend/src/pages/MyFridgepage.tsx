import React, { useState } from 'react';
import { Plus, Trash2, FolderOpen } from 'lucide-react';

// 냉장고 데이터 타입 정의
interface Fridge {
  id: number;
  name: string;
  createdAt: string;
}

const MyFridgePage = () => {
  const [fridges, setFridges] = useState<Fridge[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  const handleCreateFridge = () => {
    const newFridge: Fridge = {
      id: Date.now(),
      name: `냉장고 ${fridges.length + 1}`,
      createdAt: new Date().toLocaleDateString()
    };
    setFridges([...fridges, newFridge]);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleDeleteFridge = (id: number) => {
    setFridges(fridges.filter(fridge => fridge.id !== id));
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
              <div key={fridge.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-blue-700">
                      {fridge.name}
                    </h2>
                    <button
                      onClick={() => handleDeleteFridge(fridge.id)}
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
    </div>
  );
};

export default MyFridgePage;