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


function App() {
  return (
    <BrowserRouter>
    <MenuBar/>
          <main>
            <Routes>
              <Route path="/" element={<Main />}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/resume" element={<Resume />}/>
              <Route path="/interview" element={<Interview />}/>
              <Route path="/pay" element={<Payment />}/>

              {/* 커뮤니티 메뉴 하위항목 */}
                <Route path="/commuNotice" element={<CommuNotice />}/>
                <Route path="/commuResume" element={<CommuResume />}/>
                <Route path="/commuInfo" element={<CommuInfo />}/>
                <Route path="/commuFaq" element={<CommuFaq />}/>

              {/* 마이페이지 메뉴 하위항목 */}
              <Route path="/myPage" element={<MyPage />}/>
                <Route path="/userInfo" element={<UserInfo/>}/>
                <Route path="/myCareer" element={<MyCareer/>}/>
                <Route path="/payHistory" element={<PayHistory/>}/>
                <Route path="/postLike" element={<PostLike/>}/>
                <Route path="/resumeDetail" element={<ResumeDetail/>}/>

              {/* 관리자페이지 메뉴 하위항목 */}  
              <Route path="/adminPage" element={<AdminPage />}/>

            </Routes>
          </main>
    </BrowserRouter>
  );
}

export default App;
