import { useEffect, useState } from "react";
import "../../../css/user/myPageComponent/UserInfo.css";
import { useAuth } from "../../../context/AuthContext"; // ← 추가!
import axios from "../../../utils/axiosConfig"; // ← 추가!

const UserInfo = () => {
  const { user } = useAuth(); // ← AuthContext 사용!
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    user_name: "",
    hp: "",
    email: "",
    addr: "",
    expire_days: "",
  });

  const fetchUserInfo = async () => {
    try {
      // sessionStorage 대신 AuthContext 사용!
      if (!user?.userNo) {
        console.log("사용자 정보가 없습니다.");
        return;
      }

      // fetch 대신 axios 사용!
      const response = await axios.get(`/api/myPage/userInfo/${user.userNo}`);

      console.log("사용자 상세정보:", response);

      setUserInfo({
        user_name: response.user_name,
        hp: response.hp,
        email: response.login_id,
        addr: response.address,
        expire_days: response.expire_days ?? "미구독",
      });
    } catch (err) {
      console.error("Failed to fetch userInfo:", err);
    }
  };

  useEffect(() => {
    // user 정보가 로드된 후에 fetchUserInfo 실행
    if (user?.userNo) {
      fetchUserInfo();
    }
  }, [user]); // ← user 의존성 추가!

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    fetchUserInfo();
  };

  // 사용자 정보가 로딩 중일 때
  if (!user) {
    return (
      <div className="userInfoWrap">
        <div className="userInfoContent">
          <p>사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="userInfoWrap">
      <div className="userInfoContent">
        <div className="userInfobuttonWrap">
          {isEditing && (
            <button className="userInfoBackButton3" onClick={handleCancelClick}>
              취소하기
            </button>
          )}
          <button className="userInfoBackButton" onClick={handleEditClick}>
            수정하기
          </button>
        </div>
        <hr />

        <div className="userInfoRow">
          <p>이름</p>
          <input
            type="text"
            className={`userInfoInput ${
              isEditing ? "userInfoInput--editable" : ""
            }`}
            value={userInfo.user_name}
            onChange={(e) =>
              setUserInfo({ ...userInfo, user_name: e.target.value })
            }
            readOnly={!isEditing}
          />
        </div>
        <hr />

        <div className="userInfoRow">
          <p>연락처</p>
          <input
            type="text"
            className={`userInfoInput ${
              isEditing ? "userInfoInput--editable" : ""
            }`}
            value={userInfo.hp}
            onChange={(e) => setUserInfo({ ...userInfo, hp: e.target.value })}
            readOnly={!isEditing}
          />
        </div>
        <hr />

        <div className="userInfobuttonWrap_button">
          <p>이메일</p>
          <input
            type="text"
            className={`userInfoInput ${
              isEditing ? "userInfoInput--editable" : ""
            }`}
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
            readOnly={!isEditing}
          />
        </div>
        <hr />

        <div className="userInfoRow">
          <p>주소</p>
          <input
            type="text"
            className={`userInfoInput ${
              isEditing ? "userInfoInput--editable" : ""
            }`}
            value={userInfo.addr}
            onChange={(e) => setUserInfo({ ...userInfo, addr: e.target.value })}
            readOnly={!isEditing}
          />
        </div>
        <hr />

        <div className="userInfoRow">
          <p>구독마감일자</p>
          <input
            type="text"
            className={`userInfoInput ${
              isEditing ? "userInfoInput--editable" : ""
            }`}
            value={userInfo.expire_days}
            onChange={(e) =>
              setUserInfo({ ...userInfo, expire_days: e.target.value })
            }
            readOnly={!isEditing}
          />
        </div>
        <hr />

        <div className="userInfobuttonWrap_button">
          <p>서비스 탈퇴</p>
          <button className="userInfoBackButton2">탈퇴하기</button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
