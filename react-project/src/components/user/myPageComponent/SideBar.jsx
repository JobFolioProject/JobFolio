import '../../../css/user/myPageComponent/SideBar.css';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
   
    return (
    <div className="sideBarMenu">
      <ul className="sideBarMenuList">
        <div className="userInfo">
          <img src="" alt="" />
          <p>반가워요</p>
          <p>OOO님</p>
        </div>
        <hr className="menuDivider" />
        <li>
          <NavLink to="/userInfo" activeClassName="list-active">회원 정보</NavLink>
        </li>
        <li>
          <NavLink to="/resumeDetail" activeClassName="list-active">이력서 내역</NavLink>
        </li>
        <li>
          <NavLink to="/myCareer" activeClassName="list-active">내 커리어</NavLink>
        </li>
        <li>
          <NavLink to="/payHistory" activeClassName="list-active">결제 내역</NavLink>
        </li>
        <li>
          <NavLink to="/postLike" activeClassName="list-active">좋아요 내역</NavLink>
        </li>
        <hr />
      </ul>
    </div>
    );
};

export default SideBar;
