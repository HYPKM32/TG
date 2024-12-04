const mongoose = require('mongoose');

// 새롭게 chat 데이터베이스에 연결
const TGDB = mongoose.createConnection('mongodb+srv://rmsah32:wmftms21**@rmsah32.g7aks.mongodb.net/', {
  dbName: 'TG', // 데이터베이스 이름을 명시적으로 지정
  useNewUrlParser: true,
  useUnifiedTopology: true
});


module.exports = TGDB;

