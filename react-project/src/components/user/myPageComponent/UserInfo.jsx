import { useEffect, useState } from 'react'; // Import useState hook
import '../../../css/user/myPageComponent/UserInfo.css';

const UserInfo = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        user_name: '',
        hp: '',
        email: '',
        addr: '',
        expire_days: '',
    });

    const fetchUserInfo = async () => {
        try {
            const raw = sessionStorage.getItem('user');
            if (!raw) return;
            const { userNo } = JSON.parse(raw);
            if (!userNo) return;

            const response = await fetch(`/api/myPage/userInfo/${userNo}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            setUserInfo({
                user_name: data.user_name,
                hp: data.hp,
                email: data.login_id,
                addr: data.address,
                expire_days: data.expire_days,
            });
            console.log(data);
        } catch (err) {
            console.error('Failed to fetch userInfo:', err);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        fetchUserInfo();
    };

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
                        className="userInfoInput"
                        value={userInfo.user_name}
                        onChange={(e) => setUserInfo({ ...userInfo, user_name: e.target.value })}
                        readOnly={!isEditing}
                    />
                </div>
                <hr />

                <div className="userInfoRow">
                    <p>연락처</p>
                    <input
                        type="text"
                        className="userInfoInput"
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
                        className="userInfoInput"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, hp: e.target.value })}
                        readOnly={!isEditing}
                    />
                    {/* <button className="userInfoBackButton">설정하기</button> */}
                </div>
                <hr />

                <div className="userInfoRow">
                    <p>주소</p>
                    <input
                        type="text"
                        className="userInfoInput"
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
                        className="userInfoInput"
                        value={userInfo.expire_days}
                        onChange={(e) => setUserInfo({ ...userInfo, expire_days: e.target.value })}
                        readOnly={!isEditing}
                    />
                </div>
                <hr />

                {/* The "서비스 탈퇴" section remains visible, as requested implicitly */}
                <div className="userInfobuttonWrap_button">
                    <p>서비스 탈퇴</p>
                    <button className="userInfoBackButton2">탈퇴하기</button>
                </div>
            </div>
        </div>
    );
};
// test
export default UserInfo;
