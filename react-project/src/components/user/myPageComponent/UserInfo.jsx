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

    // 유저정보 불러오기
    const fetchUserInfo = async () => {
    try {
        const raw = sessionStorage.getItem("user");
        if (!raw) return;
        const { userNo } = JSON.parse(raw);
        if (!userNo) return;

        const response = await axios.get(`/api/myPage/userInfo/${userNo}`);

        const data = response.data;
        console.log(data);
        

        setUserInfo({
            user_no: data.user_no,
            user_name: data.user_name,
            hp: data.hp,
            login_id: data.login_id,
            address: data.address ?? "",
            expire_days: data.expire_days ? (() => {
                const date = new Date(data.expire_days);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            })()
            : "미구독"
        });
    } catch (err) {
        console.error("Failed to fetch userInfo:", err);
    }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    //유저정보 수정
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

    //유저 정보 삭제
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [password, setPassword] = useState();
    const handleDelete = async () => {
        const raw = sessionStorage.getItem("user");
        if (!raw) return;

        const { userNo } = JSON.parse(raw);
        if (!userNo) return;

        if (window.confirm("정말 탈퇴하시겠습니까?")) {

            setIsPasswordModalOpen(true);
            
        }
    };

    const userInfoCheck = async() => {
        try {
            const response = await axios.post(`/api/join/userInfoCheck`, {
                login_id: userInfo.login_id,
                password: password
            });
            if (response.status === 200 && response.data.result ==='Y') {
                const raw = sessionStorage.getItem("user");
                if (!raw) return;
                const { userNo } = JSON.parse(raw);
                if (!userNo) return;
                try {
                const response = await axios.get(`/api/myPage/userInfo/${userNo}/delete`);
                if (response.status === 200) {
                    alert("탈퇴가 완료되었습니다.");
                    sessionStorage.removeItem("user"); // 세션 정리
                    window.location.href = "/"; // 홈 또는 로그인 페이지로 리디렉션
                } else {
                    alert("탈퇴 요청에 실패했습니다.");
                }
                } catch (error) {
                console.error("탈퇴 요청 실패:", error);
                alert("탈퇴 중 오류가 발생했습니다.");
                }
                sessionStorage.removeItem("user"); // 세션 정리
                window.location.href = "/"; // 홈 또는 로그인 페이지로 리디렉션
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("탈퇴 요청 실패:", error);
            alert("탈퇴 중 오류가 발생했습니다.");
        }
    }

    // 주소 검색함수
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [tempBaseAddress, setTempBaseAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
            let fullAddress = data.roadAddress;
            if (data.buildingName) {
                fullAddress += ` (${data.buildingName})`;
            }
            fullAddress = `(${data.zonecode}) ${fullAddress}`;

            setTempBaseAddress(fullAddress); // 기본 주소 저장
            setIsDetailModalOpen(true); // 상세주소 입력 모달 열기
            }
        }).open();
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
                        onClick={() => {
                        if (isEditing) handleAddressSearch();
                        }}
                        onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                        readOnly
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
                    <button className="userInfoBackButton2" onClick={handleDelete}>
                        탈퇴하기
                    </button>
                </div>
            </div>
            {isDetailModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                    <h3>상세주소 입력</h3>
                    <p>{tempBaseAddress}</p>
                    <input
                        type="text"
                        placeholder="상세 주소를 입력하세요"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        className="userInfoInput"
                    />
                    <div style={{ marginTop: "10px" }}>
                        <button
                            className="userInfoBackButton"
                            onClick={() => {
                                if (!detailAddress.trim()) {
                                alert("상세주소를 입력해주세요.");
                                return;
                                }

                                const finalAddress = `${tempBaseAddress} ${detailAddress.trim()}`;
                                setUserInfo(prev => ({ ...prev, address: finalAddress }));
                                setIsDetailModalOpen(false);
                                setDetailAddress("");
                            }}
                        >
                        확인
                        </button>
                        <button
                        className="userInfoBackButton3"
                        onClick={() => {
                            setIsDetailModalOpen(false);
                            setDetailAddress("");
                        }}
                        >
                        취소
                        </button>
                    </div>
                    </div>
                </div>
            )}
            {isPasswordModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                    <h3>비밀번호 입력</h3>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="userInfoInput"
                    />
                    <div style={{ marginTop: "10px" }}>
                        <button
                            className="userInfoBackButton"
                            onClick={() => {
                                if (!password) {
                                alert("비밀번호를 입력해주세요.");
                                return;
                                }
                                userInfoCheck();
                                setIsPasswordModalOpen(false);
                            }}
                        >
                        확인
                        </button>
                        <button
                        className="userInfoBackButton3"
                        onClick={() => {
                            setIsPasswordModalOpen(false);
                        }}
                        >
                        취소
                        </button>
                    </div>
                    </div>
                </div>
            )}
        </div>
        
    );
};
// test
export default UserInfo;
