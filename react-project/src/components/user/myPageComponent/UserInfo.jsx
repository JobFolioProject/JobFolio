import { useState } from 'react'; // Import useState hook
import '../../../css/user/myPageComponent/UserInfo.css';

const UserInfo = () => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    return (
        <div className="userInfoWrap">
            <div className="userInfoContent">
                <div className="userInfobuttonWrap">
                    {isEditing && (
                        <button className="userInfoBackButton3" onClick={handleCancelClick}>취소하기</button>
                    )}
                    <button className="userInfoBackButton" onClick={handleEditClick}>수정하기</button>
                </div>
                <hr />

               
                <div className="userInfoRow">
                    <p>닉네임</p>
                    {isEditing && (
                            <input type="text" className="userInfoInput" />
                         )}
                        </div>
                <hr />
                
                
                <div className="userInfoRow">
                    <p>휴대폰 번호</p>
                        {isEditing && (    
                            <input type="text" className="userInfoInput" />
                        )}
                        </div>
                        <hr />
               

                <div className="userInfobuttonWrap_button">
                    <p>이메일</p>
                    <button className="userInfoBackButton">설정하기</button>
                </div>
                <hr />


                        <div className="userInfoRow">
                            <p>최종학력</p>
                            {isEditing && (    
                            <input type="text" className="userInfoInput" />
                        )}
                        </div>
                        <hr />

                        <div className="userInfoRow">
                            <p>졸업년도(예정)</p>
                            {isEditing && (    
                            <input type="text" className="userInfoInput" />
                            )}
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

export default UserInfo;