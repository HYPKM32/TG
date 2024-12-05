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

