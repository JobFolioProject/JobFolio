import '../../../css/user/myPageComponent/UserInfo.css';
import { useState } from 'react';

const MyCareer = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputFields, setInputFields] = useState(['']); 

    const handleEditClick = () => {
        setIsEditing(true);
        if (inputFields.length === 0) {
            setInputFields(['']); 
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setInputFields(['']);
    };

    const handleAddInput = () => {
        setInputFields([...inputFields, '']); 
    };


    const handleInputChange = (index, event) => {
        const newFields = [...inputFields];
        newFields[index] = event.target.value;
        setInputFields(newFields);
    };


    const handleRemoveInput = (indexToRemove) => {
        const newFields = inputFields.filter((_, index) => index !== indexToRemove);
        setInputFields(newFields);

        if (newFields.length === 0 && isEditing) {
             setInputFields(['']);
        }
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

                <div className="careerInfoRow">
                    <div className="careerInfoHeader">
                        <p>전공</p>
                        {isEditing && (
                            <p className="plusFunction" onClick={handleAddInput}>
                                추가 <img src="/plus.png" alt="추가" className="plusIcon" />
                            </p>
                        )}
                    </div>

                    {isEditing && inputFields.map((value, index) => (
                        <div key={index} className="inputWithRemoveButton">
                            <input
                                type="text"
                                className="careerInfoInput"
                                value={value}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                            
                            <img
                                src="/delete.png"
                                alt="삭제" 
                                className="removeInputButton" 
                                onClick={() => handleRemoveInput(index)}
                                style={{ cursor: 'pointer' }} 
                            />
                        </div>
                    ))}
                </div>
                <hr />

                <div className="careerInfoRow">
                    <div className="careerInfoHeader">
                        <p>자격증</p>
                        {isEditing && (
                            <p className="plusFunction" onClick={handleAddInput}>
                                추가 <img src="/plus.png" alt="추가" className="plusIcon" />
                            </p>
                        )}
                    </div>

                    {isEditing && inputFields.map((value, index) => (
                        <div key={index} className="inputWithRemoveButton">
                            <input
                                type="text"
                                className="careerInfoInput"
                                value={value}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                            
                            <img
                                src="/delete.png"
                                alt="삭제" 
                                className="removeInputButton" 
                                onClick={() => handleRemoveInput(index)}
                                style={{ cursor: 'pointer' }} 
                            />
                        </div>
                    ))}
                </div>
                <hr />


                <div className="careerInfoRow">
                    <div className="careerInfoHeader">
                        <p>외국어역량</p>
                        {isEditing && (
                            <p className="plusFunction" onClick={handleAddInput}>
                                추가 <img src="/plus.png" alt="추가" className="plusIcon" />
                            </p>
                        )}
                    </div>

                    {isEditing && inputFields.map((value, index) => (
                        <div key={index} className="inputWithRemoveButton">
                            <input
                                type="text"
                                className="careerInfoInput"
                                value={value}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                            
                            <img
                                src="/delete.png"
                                alt="삭제" 
                                className="removeInputButton" 
                                onClick={() => handleRemoveInput(index)}
                                style={{ cursor: 'pointer' }} 
                            />
                        </div>
                    ))}
                </div>
                <hr />


                <div className="careerInfoRow">
                    <div className="careerInfoHeader">
                        <p>해외거주경험</p>
                        {isEditing && (
                            <p className="plusFunction" onClick={handleAddInput}>
                                추가 <img src="/plus.png" alt="추가" className="plusIcon" />
                            </p>
                        )}
                    </div>

                    {isEditing && inputFields.map((value, index) => (
                        <div key={index} className="inputWithRemoveButton">
                            <input
                                type="text"
                                className="careerInfoInput"
                                value={value}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                            
                            <img
                                src="/delete.png"
                                alt="삭제" 
                                className="removeInputButton" 
                                onClick={() => handleRemoveInput(index)}
                                style={{ cursor: 'pointer' }} 
                            />
                        </div>
                    ))}
                </div>
                <hr />


                <div className="careerInfoRow">
                    <div className="careerInfoHeader">
                        <p>취미/특기</p>
                        {isEditing && (
                            <p className="plusFunction" onClick={handleAddInput}>
                                추가 <img src="/plus.png" alt="추가" className="plusIcon" />
                            </p>
                        )}
                    </div>

                    {isEditing && inputFields.map((value, index) => (
                        <div key={index} className="inputWithRemoveButton">
                            <input
                                type="text"
                                className="careerInfoInput"
                                value={value}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                            
                            <img
                                src="/delete.png"
                                alt="삭제" 
                                className="removeInputButton" 
                                onClick={() => handleRemoveInput(index)}
                                style={{ cursor: 'pointer' }} 
                            />
                        </div>
                    ))}
                </div>
                <hr />


                <div className="careerInfoRow">
                    <div className="careerInfoHeader">
                        <p>참고사항</p>
                        {isEditing && (
                            <p className="plusFunction" onClick={handleAddInput}>
                                추가 <img src="/plus.png" alt="추가" className="plusIcon" />
                            </p>
                        )}
                    </div>

                    {isEditing && inputFields.map((value, index) => (
                        <div key={index} className="inputWithRemoveButton">
                            <input
                                type="text"
                                className="careerInfoInput"
                                value={value}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                            
                            <img
                                src="/delete.png"
                                alt="삭제" 
                                className="removeInputButton" 
                                onClick={() => handleRemoveInput(index)}
                                style={{ cursor: 'pointer' }} 
                            />
                        </div>
                    ))}
                </div>
                <hr />

                <div className="careerInfoRow">
                    <div className="careerInfoHeader">
                        <p>경력사항</p>
                        {isEditing && (
                            <p className="plusFunction" onClick={handleAddInput}>
                                추가 <img src="/plus.png" alt="추가" className="plusIcon" />
                            </p>
                        )}
                    </div>

                    {isEditing && inputFields.map((value, index) => (
                        <div key={index} className="inputWithRemoveButton">
                            <input
                                type="text"
                                className="careerInfoInput"
                                value={value}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                            
                            <img
                                src="/delete.png"
                                alt="삭제" 
                                className="removeInputButton" 
                                onClick={() => handleRemoveInput(index)}
                                style={{ cursor: 'pointer' }} 
                            />
                        </div>
                    ))}
                </div>
                <hr />
            </div>
        </div>
    );
};

export default MyCareer;