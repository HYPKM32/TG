import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { calendarFridges, calendarFooddate } from 'api/client';

interface FoodData {
  foodType: string;
  dayset: string;
  dayend: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fridges, setFridges] = useState([]);
  const [selectedFridge, setSelectedFridge] = useState(null);
  const [foodDates, setFoodDates] = useState<FoodData[]>([]);
  
  // 음식 타입별 색상 생성
  const generateFoodColor = (foodType: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
      'bg-lime-500',
      'bg-emerald-500',
      'bg-violet-500',
      'bg-fuchsia-500',
      'bg-rose-500',
    ];
    
    // foodType 문자열을 숫자로 변환하여 일관된 색상 할당
    let sum = 0;
    for (let i = 0; i < foodType.length; i++) {
      sum += foodType.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  useEffect(() => {
    const fetchFridges = async () => {
      try {
        const response = await calendarFridges();
        if (response.success) {
          setFridges(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch fridges:', error);
      }
    };
    
    fetchFridges();
  }, []);

  useEffect(() => {
    const fetchFoodDates = async () => {
      if (selectedFridge) {
        try {
          const response = await calendarFooddate(selectedFridge);
          if (response.success) {
            setFoodDates(response.data.item);
          }
        } catch (error) {
          console.error('Failed to fetch food dates:', error);
        }
      } else {
        setFoodDates([]);
      }
    };

    fetchFoodDates();
  }, [selectedFridge]);

  const isDateInRange = (day: number, foodData: FoodData) => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const checkDate = new Date(currentYear, currentMonth, day);
    
    const [startYear, startMonth, startDay] = foodData.dayset.split('_').map(Number);
    const [endYear, endMonth, endDay] = foodData.dayend.split('_').map(Number);
    
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    
    return checkDate >= startDate && checkDate <= endDate;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day: number, currentMonth: boolean) => {
    const today = new Date();
    return currentMonth && 
           day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        currentMonth: false
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true
      });
    }

    const remainingDays = 42 - days.length;
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
          {/* Calendar header with fridge buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="text-2xl font-bold text-gray-800">
              {currentDate.getFullYear()}년 {months[currentDate.getMonth()]}
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {fridges.map((fridge) => (
                  <button
                    key={fridge}
                    onClick={() => setSelectedFridge(fridge === selectedFridge ? null : fridge)}
                    className={`
                      px-3 py-1 rounded-full text-gray-800 text-sm
                      bg-white border border-gray-300
                      hover:bg-gray-50
                      ${selectedFridge === fridge ? 'ring-2 ring-gray-400 ring-offset-2' : ''}
                      transition-all
                    `}
                  >
                    {fridge}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-2">
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
          </div>

          {/* Weekday header */}
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

          {/* Calendar days with dots */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((date, index) => (
              <div
                key={index}
                className={`
                  relative p-2 sm:p-4 text-center hover:bg-gray-50 transition-colors min-h-[60px] sm:min-h-[80px]
                  ${date.currentMonth ? 'text-gray-800' : 'text-gray-400'}
                  ${index % 7 === 0 ? 'text-red-500' : ''} 
                  ${index % 7 === 6 ? 'text-blue-500' : ''}
                  ${isToday(date.day, date.currentMonth) ? 
                    'bg-blue-50 font-bold ring-2 ring-blue-500 ring-offset-2 rounded-lg' : ''}
                `}
              >
                <span className="text-base sm:text-lg">{date.day}</span>
                {/* Food indicators as dots */}
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {date.currentMonth && selectedFridge && foodDates.map((food, foodIndex) => (
                    isDateInRange(date.day, food) && (
                      <div 
                        key={foodIndex}
                        className="flex justify-center"
                      >
                        <div 
                          className={`
                            w-3 h-3 sm:w-4 sm:h-4 rounded-full ${generateFoodColor(food.foodType)}
                            group relative cursor-pointer
                          `}
                        >
                          <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                            {food.foodType}
                          </span>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;