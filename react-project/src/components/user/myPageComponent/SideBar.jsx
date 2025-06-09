import '../../../css/user/myPageComponent/SideBar.css';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
      const loginUser = sessionStorage.getItem('loginUser'); 

    return (
    <div className="mySideBarMenu">
      <ul className="mySideBarMenuList">
        <div className="userInfo">
          <img src="" alt="" />
          <p>반가워요</p>
          <p>{loginUser}님</p>
        </div>
        <hr className="menuDivider" />
        <li>
          <NavLink to="/myPage/userInfo" activeClassName="list-active">회원 정보</NavLink>
        </li>
        <li>
          <NavLink to="/myPage/resumeDetail" activeClassName="list-active">이력서 내역</NavLink>
        </li>
        <li>
          <NavLink to="/myPage/myCareer" activeClassName="list-active">내 커리어</NavLink>
        </li>
        <li>
          <NavLink to="/myPage/payHistory" activeClassName="list-active">결제 내역</NavLink>
        </li>
        <li>
          <NavLink to="/myPage/postLike" activeClassName="list-active">좋아요 내역</NavLink>
        </li>
        <hr />
      </ul>
    </div>
    );
};

export default SideBar;
