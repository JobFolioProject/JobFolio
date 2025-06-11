import '../../../css/user/myPageComponent/UserInfo.css';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

const MyCareer = () => {
    const [isEditing, setIsEditing] = useState(false);
    
    const [inputFields, setInputFields] = useState({
        major: [''],
        certificate: [''],
        language: [''],
        abroad: [''],
        hobby: [''],
        etc: [''],
        career: ['']
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

const handleCancelClick = () => {
    setIsEditing(false);
    setInputFields({
        major: [''],
        certificate: [''],
        language: [''],
        abroad: [''],
        hobby: [''],
        etc: [''],
        career: ['']
    });
};


    const handleAddInput = (field) => {
        setInputFields({
            ...inputFields,
            [field]: [...inputFields[field], '']
        });
    };
    
    const handleInputChange = (field, index, event) => {
        const newFields = [...inputFields[field]];
        newFields[index] = event.target.value;
        setInputFields({
            ...inputFields,
            [field]: newFields
        });
    };
    
    const handleRemoveInput = (field, indexToRemove) => {
        const newFields = inputFields[field].filter((_, index) => index !== indexToRemove);
        setInputFields({
            ...inputFields,
            [field]: newFields.length === 0 ? [''] : newFields
        });
    };
    
    const renderFieldSection = (label, fieldKey) => (
        <div className="careerInfoRow">
            <div className="careerInfoHeader">
                <p>{label}</p>
                {isEditing && (
                    <p className="plusFunction" onClick={() => handleAddInput(fieldKey)}>
                        추가  <AddIcon className="plusIcon" />
                    </p>
                )}
            </div>
    
            {isEditing && inputFields[fieldKey].map((value, index) => (
                <div key={index} className="inputWithRemoveButton">
                    <input
                        type="text"
                        className="careerInfoInput"
                        value={value}
                        onChange={(e) => handleInputChange(fieldKey, index, e)}
                    />
                    <CloseIcon 
                        className="removeInputButton"
                        onClick={() => handleRemoveInput(fieldKey, index)}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            ))}
            <hr className='userCareerHr' />
        </div>
    );
    

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
    
                {renderFieldSection('전공', 'major')}
                {renderFieldSection('자격증', 'certificate')}
                {renderFieldSection('외국어역량', 'language')}
                {renderFieldSection('해외거주경험', 'abroad')}
                {renderFieldSection('취미/특기', 'hobby')}
                {renderFieldSection('참고사항', 'etc')}
                {renderFieldSection('경력사항', 'career')}
            </div>
        </div>
    );
};

export default MyCareer;