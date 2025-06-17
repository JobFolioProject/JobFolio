import { useEffect, useState } from "react";
import "../../../css/user/myPageComponent/UserInfo.css";
import { useAuth } from "../../../context/AuthContext";
import axios from "../../../utils/axiosConfig";

const UserInfo = () => {
    const { user, logout } = useAuth(); // AuthContext에서 user와 logout 가져오기
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        user_no: '',
        user_name: '',
        hp: '',
        login_id: '',
        address: '',
        expire_days: '',
    });

    // 🔐 유저정보 불러오기 (AuthContext 기반)
    const fetchUserInfo = async () => {
        try {
            // sessionStorage 대신 AuthContext 사용
            if (!user?.userNo) {
                console.log("사용자 정보가 없습니다.");
                return;
            }

            const response = await axios.get(`/api/myPage/userInfo/${user.userNo}`);
            const data = response;
            console.log("사용자 상세정보:", data);

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
                })() : "미구독"
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
    }, [user]);

    // 🔧 유저정보 수정
    const handleEditClick = async () => {
        if (!isEditing) {
            setIsEditing(true);
        } else {
            try {
                if (!user?.userNo) {
                    console.error("사용자 정보가 없습니다.");
                    return;
                }

                if (window.confirm("수정하시겠습니까?")) {
                    const cleanedUserInfo = {
                        ...userInfo,
                        user_no: user.userNo,
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

    // 🗑️ 유저 정보 삭제 (탈퇴)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [password, setPassword] = useState('');

    const handleDelete = async () => {
        if (!user?.userNo) {
            console.error("사용자 정보가 없습니다.");
            return;
        }

        if (window.confirm("정말 탈퇴하시겠습니까?")) {
            setIsPasswordModalOpen(true);
        }
    };

    const userInfoCheck = async () => {
        try {
            const response = await axios.post(`/api/join/userInfoCheck`, {
                login_id: userInfo.login_id,
                password: password
            });

            if (response.status === 200 && response.result === 'Y') {
                try {
                    const deleteResponse = await axios.get(`/api/myPage/userInfo/${user.userNo}/delete`);
                    if (deleteResponse.status === 200) {
                        alert("탈퇴가 완료되었습니다.");
                        logout(); // AuthContext의 logout 사용 (자동으로 상태 정리 및 리다이렉트)
                    } else {
                        alert("탈퇴 요청에 실패했습니다.");
                    }
                } catch (error) {
                    console.error("탈퇴 요청 실패:", error);
                    alert("탈퇴 중 오류가 발생했습니다.");
                }
            } else {
                alert(response.message || "비밀번호가 일치하지 않습니다.");
            }
        } catch (error) {
            console.error("탈퇴 요청 실패:", error);
            alert("탈퇴 중 오류가 발생했습니다.");
        }
    };

    // 📍 주소 검색 기능
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

                setTempBaseAddress(fullAddress);
                setIsDetailModalOpen(true);
            }
        }).open();
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        fetchUserInfo();
    };

    // 🔄 로딩 상태 처리
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

                <div className="userInfobuttonWrap_button">
                    <p>서비스 탈퇴</p>
                    <button className="userInfoBackButton2" onClick={handleDelete}>
                        탈퇴하기
                    </button>
                </div>
            </div>

            {/* 📍 상세주소 입력 모달 */}
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

            {/* 🔐 비밀번호 확인 모달 */}
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

export default UserInfo;