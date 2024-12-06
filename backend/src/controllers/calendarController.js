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
exports.get_dateinfo = async (req, res) => {
  try {
    const { userId, fridgeName } = req.params;
    
    // 동적으로 컬렉션 이름 설정
    fridgeSchema.set('collection', userId);
    const UserCollection = TGDB.model(`${userId} calendar`, fridgeSchema);
    
    // 냉장고 이름으로 데이터 조회
    const fridgeInfo = await UserCollection.findOne({ name: fridgeName },{ "item.foodType": 1, "item.dayset": 1, "item.dayend": 1, _id: 0 });

    if (!fridgeInfo) {
      return res.status(404).json({
        success: false,
        message: `해당하는 냉장고를 찾을 수 없습니다.${fridgeName}`
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

exports.get_fridgelist = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 동적으로 컬렉션 이름 설정
    fridgeSchema.set('collection', userId);
    const UserCollection = TGDB.model(`${userId} calendar`, fridgeSchema);
    
    // 해당 컬렉션의 모든 문서에서 name 필드만 조회
    const fridgeList = await UserCollection.find({}, { name: 1, _id: 0 });

    if (!fridgeList || fridgeList.length === 0) {
      return res.status(404).json({
        success: false,
        message: '사용자의 냉장고 목록이 없습니다.'
      });
    }

    // name 값만 추출하여 배열로 변환
    const fridgeNames = fridgeList.map(fridge => fridge.name);

    res.status(200).json({
      success: true,
      data: fridgeNames
    });

  } catch (error) {
    console.error('냉장고 목록 조회 중 오류 발생:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

exports.get_dayend = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 동적으로 컬렉션 이름 설정
    fridgeSchema.set('collection', userId);
    const UserCollection = TGDB.model(`${userId} calendar`, fridgeSchema);
    
    // 냉장고 이름과 아이템 정보 조회
    const fridgeItems = await UserCollection.find({}, 
      { "name": 1, "item.foodType": 1, "item.dayend": 1, _id: 0 });

    if (!fridgeItems || fridgeItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: '사용자의 냉장고 데이터가 없습니다.'
      });
    }

    // 모든 냉장고의 아이템들을 하나의 배열로 합치되, 냉장고 이름도 포함
    const allItems = fridgeItems.reduce((acc, fridge) => {
      if (fridge.item && fridge.item.length > 0) {
        // 각 아이템에 냉장고 이름을 추가
        const items = fridge.item.map(item => ({
          fridgeName: fridge.name,  // 냉장고 이름 추가
          foodType: item.foodType,
          dayend: item.dayend
        }));
        return [...acc, ...items];
      }
      return acc;
    }, []);

    res.status(200).json({
      success: true,
      data: allItems
    });

  } catch (error) {
    console.error('유통기한 정보 조회 중 오류 발생:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};