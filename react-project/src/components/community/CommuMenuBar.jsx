import { NavLink } from 'react-router-dom';
import '../../css/community/CommuMenuBar.css';


const CommuMenuBar = () => {

    return (
    <ul className="info-menu">
      <li>
          <NavLink to="/commuNotice" activeClassName="list-active">공지사항</NavLink>
        </li>
        <li>
          <NavLink to="/commuResume" activeClassName="list-active">이력서</NavLink>
        </li>
        <li>
          <NavLink to="/commuInfo" activeClassName="list-active">이용안내</NavLink>
        </li>
        <li>
          <NavLink to="/commuFaq" activeClassName="list-active">자주묻는질문</NavLink>
        </li>
    </ul>
    );
};

export default CommuMenuBar;
