import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import '../../../css/user/myPageComponent/SkillAddForm.css'; // SkillAddForm 전용 CSS
import ValidationMessage from './ValidationMessage';

const SkillAddForm = React.memo(({ userNo, onSave, onCancel, existingSkillList, isEditMode, onTagClick }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    // const [all]
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지

    const searchInputRef = useRef('');
    const saveButtonRef = useRef('');

    return (
        <div>
            <div></div>
        </div>
    );
});
export default SkillAddForm;
