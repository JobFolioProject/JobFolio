import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MenuBar from "./components/common/MenuBar";
import Main from "./components/Main";
import Login from "./components/user/Login";
import Resume from "./components/resume/Resume";
import Payment from "./components/pay/Payment";
import MyPage from "./components/user/MyPage";
import AdminPage from "./components/admin/AdminPage";
import UserInfo from "./components/user/myPageComponent/UserInfo";
import MyCareer from "./components/user/myPageComponent/MyCareer";
import PayHistory from "./components/user/myPageComponent/PayHistory";
import PostLike from "./components/user/myPageComponent/PostLike";
import ResumeDetail from "./components/user/myPageComponent/ResumeDetail";
import Interview from "./components/interview/Interview";
import CommuNotice from "./components/community/CommuNotice";
import CommuResume from "./components/community/CommuResume";
import CommuInfo from "./components/community/CommuInfo";
import CommuFaq from "./components/community/CommuFaq";
import UserManagement from "./components/admin/adminComponents/UserManagement";
import Footer from "./components/common/Footer";
import AdminManagement from "./components/admin/adminComponents/AdminManagement";
import SubscriptStatus from "./components/admin/adminComponents/SubscriptStatus";
import NoticeManagement from "./components/admin/adminComponents/NoticeManagement";
import ResumeManagement from "./components/admin/adminComponents/ResumeManagement";
import InfoManagement from "./components/admin/adminComponents/InfoManagement";
import FaqManagement from "./components/admin/adminComponents/FaqManagement";
import SubscriptManagement from "./components/admin/adminComponents/SubscriptManagement";
import TemplateManagement from "./components/admin/adminComponents/TemplateManagement";
import Configuration from "./components/admin/adminComponents/Configuration";
import ResumeModify from "./components/resume/ResumeModify";
import Join from "./components/user/join/JoinForm";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";
import Unauthorized from "./components/common/Unauthorized";
import NotFound from "./components/common/NotFound";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.includes("admin");

  return (
    <>
      {!isAdminPath && <MenuBar />}

      <main>
        <Routes>
          {/* ========== 모든 사용자 접근 가능 (로그인 불필요) ========== */}
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/community/notice" element={<CommuNotice />} />
          <Route path="/community/resume" element={<CommuResume />} />
          <Route path="/community/info" element={<CommuInfo />} />
          <Route path="/community/faq" element={<CommuFaq />} />
          {/* ========== 모든 사용자 접근 가능 끝 ========== */}
          {/* ========== 로그인 필수 페이지 (C, B, A 타입 모두) ========== */}
          <Route
            path="/resume/write"
            element={
              <PrivateRoute loginRequired={true}>
                <Resume />
              </PrivateRoute>
            }
          />
          <Route
            path="/resume/edit"
            element={
              <PrivateRoute loginRequired={true}>
                <ResumeModify />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <PrivateRoute loginRequired={true}>
                <Interview />
              </PrivateRoute>
            }
          />
          <Route
            path="/pay"
            element={
              <PrivateRoute loginRequired={true}>
                <Payment />
              </PrivateRoute>
            }
          />
          {/*  마이페이지*/}
          <Route
            path="/myPage"
            element={
              <PrivateRoute loginRequired={true}>
                <MyPage />
              </PrivateRoute>
            }
          >
            {/* 마이페이지 하위 페이지들*/}
            <Route index element={<UserInfo />} />
            <Route path="userInfo" element={<UserInfo />} />
            <Route path="resumeDetail" element={<ResumeDetail />} />
            <Route path="myCareer" element={<MyCareer />} />
            <Route path="payHistory" element={<PayHistory />} />
            <Route path="postLike" element={<PostLike />} />
          </Route>
          {/* ========== 로그인 필수 페이지 끝 ========== */}
          {/* ========== 관리자 전용 (A, B 권한)========== */}
          <Route
            path="/adminPage"
            element={
              <PrivateRoute requiredRoles={["A", "B"]}>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/adminPage/userManagement"
            element={
              <PrivateRoute requiredRoles={["A", "B"]}>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/adminPage/subscriptStatus"
            element={
              <PrivateRoute requiredRoles={["A", "B"]}>
                <SubscriptStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="/adminPage/noticeManagement"
            element={
              <PrivateRoute requiredRoles={["A", "B"]}>
                <NoticeManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/adminPage/resumeManagement"
            element={
              <PrivateRoute requiredRoles={["A", "B"]}>
                <ResumeManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/adminPage/infoManagement"
            element={
              <PrivateRoute requiredRoles={["A", "B"]}>
                <InfoManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/adminPage/faqManagement"
            element={
              <PrivateRoute requiredRoles={["A", "B"]}>
                <FaqManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/adminPage/subscriptManagement"
            element={
              <PrivateRoute requiredRoles={["A", "B"]}>
                <SubscriptManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/adminPage/templateManagement"
            element={
              <PrivateRoute requiredRoles={["A", "B"]}>
                <TemplateManagement />
              </PrivateRoute>
            }
          />
          {/* ========== 관리자 전용 (A, B 권한) 끝 ========== */}
          {/* ========== 최고관리자 전용 (A 권한만) ========== */}
          <Route
            path="/adminPage/adminManagement"
            element={
              <PrivateRoute requiredRoles={["A"]}>
                <AdminManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/adminPage/configuration"
            element={
              <PrivateRoute requiredRoles={["A"]}>
                <Configuration />
              </PrivateRoute>
            }
          />
          {/* ========== 최고관리자 전용 (A 권한만) 끝 ========== */}
          {/* ========== 에러 페이지 ========== */}
          <Route path="/unauthorized" element={<Unauthorized />} />{" "}
          {/* 권한 없음 페이지 */}
          <Route path="*" element={<NotFound />} />{" "}
          {/* 404 페이지 (존재하지 않는 경로) */}
          {/* ========== 에러 페이지 끝 ========== */}
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </>
  );
}

export default App;
