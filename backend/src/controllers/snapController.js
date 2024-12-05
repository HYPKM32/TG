const axios = require('axios');
const FormData = require('form-data');
const TECHEND_URL1 = 'http://210.117.211.26:2000/api/snap';
const TECHEND_URL2 = 'http://210.117.211.26:2000/api/get_list';

const snapController = {
    processImage: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
            }

            // 1. 이미지 처리 요청
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
                maxContentLength: 100 * 1024 * 1024, // 100MB
                timeout: 60000
            });

            console.log('Image processed, getting list data...');
            const listResponse = await axios.get(TECHEND_URL2);

            // 처리된 이미지와 헤더 설정
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
    }
};

module.exports = snapController;