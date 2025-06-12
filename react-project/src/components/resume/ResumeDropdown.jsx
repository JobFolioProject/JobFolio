import React, {useState, useEffect, useRef} from 'react';
import '../../css/resume/ResumeDropdown.css'; // 스타일 따로 작성

const DropDown = ({ options,  onSelect, placeholder, selected}) => {
    const [isOpen, setIsOpen] = useState(false);
    // const [selected, setSelected] = useState(null);
    const dropdownRef = useRef(null); // 드롭다운 참조


    
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    const handleSelect = (option, event) => {
        if (event) {
            event.preventDefault(); // 기본 이벤트 방지
        }
        // event.stopPropagation(); // 이벤트 전파 방지
        console.log("Dropdown closed:", isOpen);
        // setSelected(option);
        onSelect(option);
        setIsOpen(false);
        console.log("Selected option:", option);
        // 선택 후 드롭다운 닫기 확인
    }

  
    useEffect(()=>{
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[isOpen]);
    // [] 안에 아무것도 넣지 않으면 컴포넌트가 마운트될 때 한 번만 실행됩니다.
    // isopen을 넣으면 외부를 누를때마다 닫히고 열리고 함.


    return (
        <div className='dropdown' ref={dropdownRef}> {/* 드롭다운 참조 추가*/}
            <button type="button" className='dropdown-toggle' onClick={toggleDropdown}>
                {selected || placeholder}▼
            </button>
            {isOpen && (
                <ul className='dropdown-menu'>
                    {options.map((option, index)=>(
                        <li key={index} onClick={(e) => handleSelect(option, e)}>
                            {option}
                        </li>
                    ))}

                </ul>
            )}

        </div>
    );

};

export default DropDown;