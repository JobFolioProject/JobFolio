import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MenuBar from './components/common/MenuBar';
import Main from './components/Main';
import Login from './components/user/Login';
import Resume from './components/resume/Resume';
import Payment from './components/pay/Payment';
import MyPage from './components/user/MyPage';
import AdminPage from './components/admin/AdminPage';
import UserInfo from './components/user/myPageComponent/UserInfo';
import MyCareer from './components/user/myPageComponent/MyCareer';
import PayHistory from './components/user/myPageComponent/PayHistory';
import PostLike from './components/user/myPageComponent/PostLike';
import ResumeDetail from './components/user/myPageComponent/ResumeDetail';
import Interview from './components/interview/Interview';
import CommuNotice from './components/community/CommuNotice';
import CommuResume from './components/community/CommuResume';
import CommuInfo from './components/community/CommuInfo';
import CommuFaq from './components/community/CommuFaq';
import UserManagement from './components/admin/adminComponents/UserManagement';
import Footer from './components/common/Footer';
import AdminManagement from './components/admin/adminComponents/AdminManagement';
import SubscriptStatus from './components/admin/adminComponents/SubscriptStatus';
import NoticeManagement from './components/admin/adminComponents/NoticeManagement';
import ResumeManagement from './components/admin/adminComponents/ResumeManagement';
import InfoManagement from './components/admin/adminComponents/InfoManagement';
import FaqManagement from './components/admin/adminComponents/FaqManagement';
import SubscriptManagement from './components/admin/adminComponents/SubscriptManagement';
import TemplateManagement from './components/admin/adminComponents/TemplateManagement';
import Configuration from './components/admin/adminComponents/Configuration';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.includes('admin'); // 'admin'이 경로에 포함되었는지 확인

  return (
    <>
      {!isAdminPath && <MenuBar />}
      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resume/write" element={<Resume />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/pay" element={<Payment />} />

          {/* 커뮤니티 메뉴 하위항목 */}
          <Route path="/community/notice" element={<CommuNotice />} />
          <Route path="/community/resume" element={<CommuResume />} />
          <Route path="/community/info" element={<CommuInfo />} />
          <Route path="/community/faq" element={<CommuFaq />} />

         {/* 마이페이지 메뉴 하위항목 */}
         <Route path="/myPage" element={<MyPage />}>
            <Route index element={<UserInfo />} /> 
            <Route path="userInfo" element={<UserInfo />} />
            <Route path="resumeDetail" element={<ResumeDetail />} />
            <Route path="myCareer" element={<MyCareer />} />
            <Route path="payHistory" element={<PayHistory />} />
            <Route path="postLike" element={<PostLike />} />
          </Route>

          {/* 관리자페이지 메뉴 하위항목 */}
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/adminPage/userManagement" element={<UserManagement />} />
          <Route path="/adminPage/adminManagement" element={<AdminManagement />} />
          <Route path="/adminPage/subscriptStatus" element={<SubscriptStatus />} />
          <Route path="/adminPage/noticeManagement" element={<NoticeManagement />} />
          <Route path="/adminPage/resumeManagement" element={<ResumeManagement />} />
          <Route path="/adminPage/infoManagement" element={<InfoManagement />} />
          <Route path="/adminPage/faqManagement" element={<FaqManagement />} />
          <Route path="/adminPage/subscriptManagement" element={<SubscriptManagement />} />
          <Route path="/adminPage/templateManagement" element={<TemplateManagement />} />
          <Route path="/adminPage/configuration" element={<Configuration />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </>
  );
}


export default App;
