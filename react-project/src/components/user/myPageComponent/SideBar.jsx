import '../../../css/user/myPageComponent/SideBar.css';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
      const loginUser = sessionStorage.getItem('loginUser'); 

    return (
    <div className="mySideBarMenu">
      <ul className="mySideBarMenuList">
        <div className="userInfo">
          <p className="imogi">🖐</p>  
          <p>반가워요</p>
          <div className="userNameWrap"><p className="userName">{loginUser}</p>님</div>
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
