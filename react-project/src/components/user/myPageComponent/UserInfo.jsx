import { useEffect, useState } from 'react'; // Import useState hook
import '../../../css/user/myPageComponent/UserInfo.css';
import axios from "axios";


const UserInfo = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        user_no: '',
        user_name: '',
        hp: '',
        login_id: '',
        address: '',
        expire_days: '',
    });

    const fetchUserInfo = async () => {
    try {
        const raw = sessionStorage.getItem("user");
        if (!raw) return;
        const { userNo } = JSON.parse(raw);
        if (!userNo) return;

        const response = await axios.get(`/api/myPage/userInfo/${userNo}`);

        const data = response.data;

        setUserInfo({
        user_no: data.user_no,
        user_name: data.user_name,
        hp: data.hp,
        login_id: data.login_id,
        address: data.address ?? "",
        expire_days: data.expire_days ?? "미구독",
        });

        console.log("받은 데이터:", data);
    } catch (err) {
        console.error("Failed to fetch userInfo:", err);
    }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

   const handleEditClick = async () => {
        if (!isEditing) {
            setIsEditing(true);
        } else {
            try {
            const raw = sessionStorage.getItem("user");
            if (!raw) return;

            const { userNo } = JSON.parse(raw);
            if (!userNo) return;

            if (window.confirm("수정하시겠습니까?")) {
                const cleanedUserInfo = {
                ...userInfo,
                user_no: userNo,
                address: userInfo.address === "" ? null : userInfo.address,
                expire_days: userInfo.expire_days === "미구독" ? null : userInfo.expire_days,
                };

                const response = await axios.post(`/api/myPage/editUserInfo`, cleanedUserInfo);

                if (response.status === 200) {
                alert("수정이 완료되었습니다.");
                setIsEditing(false);
                } else {
                alert("수정 실패: " + response.statusText);
                }
            }
            } catch (err) {
            console.error("Failed to update userInfo:", err);
            alert("수정 중 오류 발생");
            }
        }
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
                        className={`userInfoInput ${isEditing ? 'userInfoInput--editable' : ''}`}
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
                        className={`userInfoInput ${isEditing ? 'userInfoInput--editable' : ''}`}
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
                        className={`userInfoInput ${isEditing ? 'userInfoInput--editable' : ''}`}
                        value={userInfo.login_id}
                        readOnly
                    />
                    {/* <button className="userInfoBackButton">설정하기</button> */}
                </div>
                <hr />

                <div className="userInfoRow">
                    <p>주소</p>
                    <input
                        type="text"
                        className={`userInfoInput ${isEditing ? 'userInfoInput--editable' : ''}`}
                        value={userInfo.address}
                        onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                        readOnly={!isEditing}
                    />
                </div>
                <hr />

                <div className="userInfoRow">
                    <p>구독마감일자</p>
                    <input
                        type="text"
                        className={`userInfoInput ${isEditing ? 'userInfoInput--editable' : ''}`}
                        value={userInfo.expire_days}
                        onChange={(e) => setUserInfo({ ...userInfo, expire_days: e.target.value })}
                        readOnly
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
