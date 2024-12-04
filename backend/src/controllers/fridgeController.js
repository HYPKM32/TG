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
  collection: 'fridge'  // 컬렉션 이름을 'fridge'로 명시적 지정
});

// 모델 생성 - 첫 번째 인자는 단수형으로 작성하는 것이 관례
const Fridge = TGDB.model('Fridge', fridgeSchema);

// 냉장고 정보 조회 컨트롤러
exports.get_fridgeinfo = async (req, res) => {
  try {
    const { fridgeName } = req.params;

    // 냉장고 이름으로 데이터 조회
    const fridgeInfo = await Fridge.findOne({ name: fridgeName });

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