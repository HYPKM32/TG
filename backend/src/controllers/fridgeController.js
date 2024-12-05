const mongoose = require('mongoose');
const TGDB = require('../db/TGDB');

// 냉장고 스키마 정의
const fridgeSchema = new mongoose.Schema({
  name: String,
  item: [{
    foodType: String,
    imgPath: String,
    dayset: String,
    dayend: String
  }]
}, {
  versionKey: false   
});

// 냉장고 정보 조회 컨트롤러
exports.get_fridgeinfo = async (req, res) => {
  try {
    const { userId, fridgeName } = req.params;
    
    // 동적으로 컬렉션 이름 설정
    fridgeSchema.set('collection', userId);
    const UserCollection = TGDB.model(userId, fridgeSchema);
    
    // 해당 사용자의 냉장고 정보 조회
    const fridgeInfo = await UserCollection.findOne({ name: fridgeName });

    if (!fridgeInfo) {
      return res.status(404).json({
        success: false,
        message: '해당하는 냉장고를 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      data: fridgeInfo
    });

  } catch (error) {
    console.error('냉장고 정보 조회 중 오류 발생:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

exports.add_fridge = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 동적으로 컬렉션 이름 설정
    fridgeSchema.set('collection', userId);
    const UserCollection = TGDB.model(userId, fridgeSchema);
    
    // 현재 컬렉션의 모든 냉장고 이름 조회
    const existingFridges = await UserCollection.find({}, { name: 1 });
    
    // 새로운 냉장고 이름 생성 로직
    let nextFridgeNumber = 1;
    const fridgeNumbers = existingFridges
      .map(fridge => {
        const match = fridge.name?.match(/^fridge(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num > 0)
      .sort((a, b) => a - b);

    if (fridgeNumbers.length > 0) {
      // 연속된 숫자에서 빈 숫자 찾기
      for (let i = 0; i < fridgeNumbers.length; i++) {
        if (fridgeNumbers[i] !== i + 1) {
          nextFridgeNumber = i + 1;
          break;
        }
      }
      // 모든 숫자가 연속적이면 마지막 숫자 + 1
      if (nextFridgeNumber === 1) {
        nextFridgeNumber = fridgeNumbers[fridgeNumbers.length - 1] + 1;
      }
    }

    // 새로운 냉장고 생성
    const newFridge = new UserCollection({
      name: `fridge${nextFridgeNumber}`,
      item: []
    });

    // 데이터베이스에 저장
    await newFridge.save();

    res.status(201).json({
      success: true,
      message: '새로운 냉장고가 생성되었습니다.',
      data: newFridge
    });

  } catch (error) {
    console.error('냉장고 추가 중 오류 발생:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

exports.list_fridge = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 동적으로 컬렉션 이름 설정
    fridgeSchema.set('collection', userId);
    const UserCollection = TGDB.model(userId, fridgeSchema);
    
    // 해당 컬렉션의 모든 냉장고 name 필드 조회
    const fridges = await UserCollection.find({}, { name: 1, _id: 1 });

    if (!fridges || fridges.length === 0) {
      return res.status(200).json({
        success: true,
        message: '등록된 냉장고가 없습니다.',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: '냉장고 목록을 성공적으로 가져왔습니다.',
      data: fridges
    });

  } catch (error) {
    console.error('냉장고 목록 조회 중 오류 발생:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};