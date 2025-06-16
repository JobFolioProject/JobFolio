import React, { useState, useRef, useEffect, useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import ValidationMessage from './ValidationMessage';
import '../../../css/user/myPageComponent/SkillSection.css';

// 입력 받을 폼 데이터
const formSkillData = {
    user_no: null,
    skill_code: '',
    group_code: '',
    exp_level: '',
    skill_tool: '',
};

const SkillSection = React.memo(({ userNo, skillList, onListChange }) => {
    const [showAddForm, setShowAddForm] = useState(false); // 새로운 언어 폼
    const [editingSkill, seteditingSkill] = useState(null); // 수정중인 스킬
    const [currentFormSkill, setCurrentFormSkill] = useState(formSkillData); // 업데이트할 항목의 데이터를 초기화

    const [errorMessage, setErrorMessage] = useState('');

    const [errors, setErrors] = useState({
        skill_code: false,
        group_code: false,
        exp_level: false,
        skill_tool: false,
    });

    // 스킬 최대 개수 설정
    const MAX_SKILL_COUNT = 5;
    // 추가 버튼 활성화 여부
    const isAddButtonDisabled = skillList.length >= MAX_SKILL_COUNT;

    // 폼 열기
    const addSkill = () => {
        if (skillList.length >= MAX_SKILL_COUNT) {
            alert(`스킬은 최대 ${MAX_SKILL_COUNT}개 까지만 추가할 수 있습니다.`);
            return;
        }
        setCurrentFormSkill(formSkillData);
        setShowAddForm(true);
        seteditingSkill(null);
    };
    return (
        <div>
            <p>여기는 스킬이야</p>
        </div>
    );
});

export default SkillSection;
