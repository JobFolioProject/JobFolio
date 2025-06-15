import "../../../css/user/myPageComponent/SideBar.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // ← 추가!

const SideBar = () => {
  // const loginUser = JSON.parse(sessionStorage.getItem('user')); ← 삭제!
  const { user, isAuthenticated, isLoading } = useAuth(); // ← AuthContext 사용!

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="mySideBarMenu">
        <div className="userInfo">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인하지 않았을 때 (방어코드)
  if (!isAuthenticated || !user) {
    return (
      <div className="mySideBarMenu">
        <div className="userInfo">
          <p>로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mySideBarMenu">
      <ul className="mySideBarMenuList">
        <div className="userInfo">
          <p className="imogi">🖐</p>
          <p>반가워요</p>
          <div className="userNameWrap">
            <p className="userName">{user.userName}</p>님{" "}
            {/* ← user.userName 사용! */}
          </div>
        </div>
        <hr className="menuDivider" />

        <li>
          <NavLink
            to="/myPage/userInfo"
            className={({ isActive }) => (isActive ? "list-active" : "")}
          >
            회원정보
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/myPage/resumeDetail"
            className={({ isActive }) => (isActive ? "list-active" : "")}
          >
            이력서 내역
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/myPage/myCareer"
            className={({ isActive }) => (isActive ? "list-active" : "")}
          >
            내 커리어
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/myPage/payHistory"
            className={({ isActive }) => (isActive ? "list-active" : "")}
          >
            결제 내역
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/myPage/postLike"
            className={({ isActive }) => (isActive ? "list-active" : "")}
          >
            좋아요 내역
          </NavLink>
        </li>
        <hr className="menuDivider2" />
      </ul>
    </div>
  );
};

export default SideBar;
