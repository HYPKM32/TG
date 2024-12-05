const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const TGDB = require('../db/TGDB');
const JWT_SECRET = "freshbuddy_secret_key_2024";
const mongoose = require('mongoose');

exports.register = async (req, res) => {
    try {
      const { name, userId, pwd } = req.body;
  
      // TGDB의 users 컬렉션 접근
      const usersCollection = TGDB.collection('users');
  
      // 아이디 중복 체크
      const existingUser = await usersCollection.findOne({ userId });
      if (existingUser) {
        return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(pwd, salt);
  
      // 새 사용자 데이터 생성
      const newUser = {
        name,
        userId,
        password: hashedPassword,
        createdAt: new Date()
      };
  
      // 1. users 컬렉션에 새 사용자 저장
      await usersCollection.insertOne(newUser);
  
      // 2. 사용자별 컬렉션 생성
      let UserCollection;
      try {
        // 기존 모델이 있는지 확인
        UserCollection = TGDB.model(userId);
      } catch (e) {
        // 모델이 없는 경우 새로 생성
        const userSchema = new mongoose.Schema({}, { strict: false });
        UserCollection = TGDB.model(userId, userSchema);
      }
      
      // 컬렉션이 실제로 생성되도록 빈 문서 하나 생성 후 삭제
      const dummyDoc = new UserCollection({});
      await dummyDoc.save();
      await UserCollection.findByIdAndDelete(dummyDoc._id);
  
      console.log(`Collection ${userId} created successfully`);
  
      res.status(201).json({ 
        message: '회원가입이 완료되었습니다.',
        user: {
          name,
          userId,
          createdAt: newUser.createdAt
        }
      });
  
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  };

exports.login = async (req, res) => {
  try {
    const { userId, pwd } = req.body;

    // TGDB의 users 컬렉션 접근
    const usersCollection = TGDB.collection('users');

    // 사용자 찾기
    const user = await usersCollection.findOne({ userId });
    if (!user) {
      return res.status(400).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const isMatch = await bcrypt.compare(pwd, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const token = jwt.sign(
      { id: user._id, userId: user.userId },
      JWT_SECRET,  // 직접 정의한 JWT_SECRET 사용
      { expiresIn: '1d' }
    );

    res.json({
      message: '로그인 성공',
      token,
      user: {
        name: user.name,
        userId: user.userId
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

exports.logout = (req, res) => {
  try {
    res.json({ 
      success: true,
      message: '로그아웃 되었습니다.' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};