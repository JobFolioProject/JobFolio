import { NavLink } from 'react-router-dom';
import {  useState } from 'react';
import "../../css/admin/AdminSideBar.css";

const AdminSideBar = () => {

  // 드롭 다운 메뉴
  const [dropDownVisible, setDropDown] = useState(false);

  return (
    <div className="adminSideBar">
      <div className="sideBarWrapper">
        <div className="sideBarMenu">
          <h2 className="sideBarTitle">JobFolio</h2>
          <hr className="menuDivider" />
          <ul className="sideBarMenuList">
            <li className="list-item">
              <NavLink to="/" activeClassName="list-active">
                사이트 바로가기
              </NavLink>
            </li>
            <li className="list-item">
              <NavLink to="/" activeClassName="list-active">
                회원 관리
              </NavLink>
            </li>
            <li className="list-item">
              <NavLink to="/" activeClassName="list-active">
                관리자 계정 관리
              </NavLink>
            </li>
            <li className="list-item">
              <NavLink to="/" activeClassName="list-active">
                이용권 현황
              </NavLink>
            </li>
            <li className="list-item" onClick={(e) => setDropDown(!dropDownVisible)}>
              <span className="dropDownMenuTitle">
                커뮤니티 관리
                <span className='arrow'>
                {
                  dropDownVisible ? " ∧" : " ∨"
                }
                </span>
              </span>
            </li>
            <div className={`sideBarDropDownMenuList ${dropDownVisible ? 'slide-fade-in-dropdown' : 'slide-fade-out-dropdown'}`}>
              <ul>
                <li className="list-item">
                  <NavLink to="/" activeClassName="list-active">
                    공지사항
                  </NavLink>
                </li>
                <li className="list-item">
                  <NavLink to="/" activeClassName="list-active">
                    이력서
                  </NavLink>
                </li>
                <li className="list-item">
                  <NavLink to="/" activeClassName="list-active">
                    이용안내
                  </NavLink>
                </li>
                <li className="list-item">
                  <NavLink to="/" activeClassName="list-active">
                    FAQ
                  </NavLink>
                </li>
              </ul>
            </div>
            <li className="list-item">
              <NavLink to="/" activeClassName="list-active">
                상품 관리
              </NavLink>
            </li>
            <li className="list-item">
              <NavLink to="/" activeClassName="list-active">
                템플릿 관리
              </NavLink>
            </li>
            <li className="list-item">
              <NavLink to="/" activeClassName="list-active">
                설정값
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminSideBar;
