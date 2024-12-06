const axios = require('axios');
const FormData = require('form-data');
const mongoose = require('mongoose');
const TECHEND_URL1 = 'http://210.117.211.26:2000/api/snap';
const TECHEND_URL2 = 'http://210.117.211.26:2000/api/get_list';
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

// 채소 정보 스키마 정의
const vegetableSchema = new mongoose.Schema({
    vegetables: [{
        name: String,
        category: String,
        shelf_life: Number
    }]
});

// 채소 정보 모델은 한 번만 정의
const FridgeCollection = TGDB.model('fridge', vegetableSchema);

const snapController = {
    processImage: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
            }

            const formData = new FormData();
            formData.append('file', req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype
            });

            console.log('Sending request to snap API...');
            const imageResponse = await axios.post(TECHEND_URL1, formData, {
                headers: {
                    ...formData.getHeaders()
                },
                responseType: 'arraybuffer',
                maxContentLength: 100 * 1024 * 1024,
                timeout: 60000
            });

            console.log('Image processed, getting list data...');
            const listResponse = await axios.get(TECHEND_URL2);

            res.set('Content-Type', 'image/jpeg');
            res.set('X-Labels', JSON.stringify(listResponse.data));
            res.send(imageResponse.data);

        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data instanceof Buffer 
                        ? 'Binary Data' 
                        : error.response.data
                } : null
            });

            if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
                return res.status(503).json({
                    error: '이미지 처리 서버에 연결할 수 없습니다.',
                    details: error.code
                });
            }

            if (error.response) {
                return res.status(error.response.status).json({
                    error: '이미지 처리 중 오류가 발생했습니다.',
                    details: error.response.data
                });
            }

            res.status(500).json({
                error: '서버 오류가 발생했습니다.',
                details: error.message
            });
        }
    },

    putfridge: async (req, res) => {
        try {
            const { userId, fridgeName, foodName } = req.params;
            console.log('Received request params:', { userId, fridgeName, foodName });
            
            // 동적으로 사용자 컬렉션 모델 생성
            let UserCollection;
            try {
                UserCollection = TGDB.model(userId);
            } catch (e) {
                fridgeSchema.set('collection', userId);
                UserCollection = TGDB.model(userId, fridgeSchema);
            }

            // 전체 채소 데이터 확인
            const allData = await FridgeCollection.findOne();
            console.log('전체 채소 데이터:', JSON.stringify(allData, null, 2));
            console.log('검색할 채소 이름:', foodName.toLowerCase());

            // 수정된 검색 쿼리
            const vegetableInfo = await FridgeCollection.findOne({
                "vegetables": {
                    $elemMatch: {
                        "name": foodName.toLowerCase()
                    }
                }
            });

            console.log('검색 결과:', vegetableInfo ? '채소 찾음' : '채소 못찾음');

            if (!vegetableInfo) {
                return res.status(404).json({
                    error: '해당 채소를 찾을 수 없습니다.',
                    searchedName: foodName.toLowerCase()
                });
            }

            // 일치하는 채소 찾기
            const vegetable = vegetableInfo.vegetables.find(
                v => v.name === foodName.toLowerCase()
            );

            console.log('찾은 채소 정보:', vegetable);

            if (!vegetable || typeof vegetable.shelf_life !== 'number') {
                return res.status(400).json({
                    error: '유통기한 정보를 찾을 수 없습니다.'
                });
            }

            const today = new Date();
            const endDate = new Date(today);
            endDate.setDate(today.getDate() + vegetable.shelf_life);

            // 날짜 포맷 변환 (YYYY_MM_DD)
            const formatDate = (date) => {
                return `${date.getFullYear()}_${String(date.getMonth() + 1).padStart(2, '0')}_${String(date.getDate()).padStart(2, '0')}`;
            };

            const newItem = {
                foodType: foodName.toLowerCase(),
                imgPath: "",
                dayset: formatDate(today),
                dayend: formatDate(endDate)
            };

            console.log('냉장고에 추가할 아이템:', newItem);

            const result = await UserCollection.updateOne(
                { name: fridgeName },
                { $push: { item: newItem } }
            );

            if (result.matchedCount === 0) {
                console.log('냉장고를 찾을 수 없음:', fridgeName);
                return res.status(404).json({
                    error: '해당하는 냉장고를 찾을 수 없습니다.'
                });
            }

            console.log('아이템 추가 성공');
            res.status(200).json({
                data: newItem
            });

        } catch (error) {
            console.error('Error in putfridge:', error);
            res.status(500).json({
                error: '서버 오류가 발생했습니다.',
                details: error.message
            });
        }
    }
};

module.exports = snapController;