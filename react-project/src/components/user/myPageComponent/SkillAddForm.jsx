import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import '../../../css/user/myPageComponent/SkillAddForm.css'; // SkillAddForm 전용 CSS
import ValidationMessage from './ValidationMessage';

const SkillAddForm = React.memo(({ userNo, onSave, onCancel, existingSkillList, isEditMode, onTagClick }) => {
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색 키워드
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지
    const [allAvailableSkills, setAllAvailableSkills] = useState([]); // 백에서 불러온 모든 데이터
    const [filterSkills, setFilterSkills] = useState([]); // 검색에 따라 필터된 스킬 목록들
    const searchInputRef = useRef(''); // 포커스
    const saveButtonRef = useRef(''); // 스크롤 / 포커스용

    return (
        <div>
            <div>폼 나옴??</div>
        </div>
    );
});
export default SkillAddForm;
