import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/Mainpage';
import AboutPage from './pages/Aboutpage';
import NotFoundPage from './pages/Notfoundpage';
import MyFridgePage from './pages/MyFridgepage';
import SnapFoodPage from './pages/SnapFoodpage';
import CalendarPage from './pages/Calendarpage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="/fridge" element={<MyFridgePage />} />
          <Route path="/snap" element={<SnapFoodPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;