import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "../../css/admin/AdminSideBar.css";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const menuData = [
  { name: "사이트 바로가기", path: "/" },
  // { name: "회원 관리", path: "/adminPage/userManagement" },
  { name: "계정 관리", path: "/adminPage/adminManagement" },
  { name: "이용권 현황", path: "/adminPage/subscriptStatus" },
  {
    name: "커뮤니티 관리",
    children: [
      { name: "공지사항", path: "/adminPage/noticeManagement" },
      { name: "이력서", path: "/adminPage/resumeManagement" },
      { name: "이용안내", path: "/adminPage/infoManagement" },
      { name: "FAQ", path: "/adminPage/faqManagement" }
    ]
  },
  { name: "상품 관리", path: "/adminPage/subscriptManagement" },
  { name: "템플릿 관리", path: "/adminPage/templateManagement" },
  { name: "공통코드 관리", path: "/adminPage/groupManagement" }
];

const AdminSideBar = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  // 커뮤니티 하위 경로 자동 열기
  useEffect(() => {
    const opened = menuData.find(menu =>
      menu.children?.some(child => child.path === location.pathname)
    );
    setOpenMenu(opened?.name || null);
  }, [location]);

  return (
    <div className="adminSideBar">
      <div className="sideBarWrapper">
        <div className="sideBarMenu">
          <h2 className="sideBarTitle">JobFolio</h2>
          <hr className="menuDivider" />
          <ul className="sideBarMenuList">
            {menuData.map((menu, idx) =>
              menu.children ? (
                <li key={idx} className="list-item">
                  <div
                    className={`dropDownMenuTitle ${openMenu === menu.name ? "list-active" : ""}`}
                    onClick={() => setOpenMenu(openMenu === menu.name ? null : menu.name)}
                  >
                    {menu.name}
                    <span className="arrow">
                      {openMenu === menu.name ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </span>
                  </div>
                  <div className={`sideBarDropDownMenuList ${openMenu === menu.name ? 'slide-fade-in-dropdown' : 'slide-fade-out-dropdown'}`}>
                    <ul>
                      {menu.children.map((sub, subIdx) => (
                        <li key={subIdx} className="list-item">
                          <NavLink to={sub.path} className={({ isActive }) => isActive ? "list-active" : ""}>
                            {sub.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={idx} className="list-item">
                  <NavLink to={menu.path} className={({ isActive }) => isActive ? "list-active" : ""}>
                    {menu.name}
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;