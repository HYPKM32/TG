import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 달력 관련 유틸리티 함수들
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // 이전 달로 이동
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  // 다음 달로 이동
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // 달력 데이터 생성
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    // 이전 달의 날짜들
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        currentMonth: false
      });
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true
      });
    }

    // 다음 달의 날짜들
    const remainingDays = 42 - days.length; // 6주 x 7일 = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        currentMonth: false
      });
    }

    return days;
  };

  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* 캘린더 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-2xl font-bold text-gray-800">
              {currentDate.getFullYear()}년 {months[currentDate.getMonth()]}
            </div>
            <div className="flex gap-4">
              <button 
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day) => (
              <div 
                key={day} 
                className="text-center font-semibold py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 달력 날짜들 */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((date, index) => (
              <div
                key={index}
                className={`
                  relative p-4 text-center hover:bg-gray-50 transition-colors
                  ${date.currentMonth ? 'text-gray-800' : 'text-gray-400'}
                  ${index % 7 === 0 ? 'text-red-500' : ''} 
                  ${index % 7 === 6 ? 'text-blue-500' : ''}
                `}
              >
                {date.day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;