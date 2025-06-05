import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Menubar from './components/common/Menubar';
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


function App() {
  return (
    <BrowserRouter>
    <Menubar/>
          <main>
            <Routes>
              <Route path="/" element={<Main />}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/resume" element={<Resume />}>
                 {/* <Route path="/resume" element={<ResumeWrite  />}/> */}
              </Route>
              <Route path="/pay" element={<Payment />}/>
              <Route path="/myPage" element={<MyPage />}/>
                <Route path="/userInfo" element={<UserInfo/>}/>
                <Route path="/myCareer" element={<MyCareer/>}/>
                <Route path="/payHistory" element={<PayHistory/>}/>
                <Route path="/postLike" element={<PostLike/>}/>
                <Route path="/resumeDetail" element={<ResumeDetail/>}/>
              <Route path="/adminPage" element={<AdminPage />}/>

            </Routes>
          </main>
    </BrowserRouter>
  );
}

export default App;
