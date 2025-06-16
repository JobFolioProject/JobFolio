import React, { useState, useEffect } from "react";
import axios from "axios";
import PrettyBtn from "./PrettyBtn";
import TemplateSlider from "./TemplateSlider";

const TemplateSelection = () => {

//모든 템플릿 리스트 조회하기. 10개면 10개
//--> 어떻게 담아올라나 {0:{temp_no:1,temp_nm:g, ...},1:{temp_no:2,temp_nm:h, ...},...10:{temp_no:10,temp_nm:k, ...}} 이런식?
// 배열 형태의 데이터를 담기 위해서는 tempList 상태를 배열로 초기화하고 관리
    const [tempList,setTempList] = useState([]);
    // 로딩 상태 (API호출 중인지)
    const [isLoading, setIsLoading] = useState(false);
    // 에러 상태 (API 호출 실패시)
    const [error, setError] = useState(null);


    //xml : select * from tb_template
    const templateInfo = async() => {
        setIsLoading(true); //로딩시작
        setError(null); //에러 상태 초기화
        await axios.get('resume/templateinfo')
        .then((res)=>{
            console.log("템플렛 조회 결과:" , res.data);
            setTempList(res.data); //json 배열 형태로 받아왔으니까 그대로 담아서 넘겨준다<div className=""></div>
        })
        .catch((err)=>{
            console.log("템플릿 조회 중 오류 발생", err);
            setError("템플릿을 불러오는 데 실패했습니다.")
            setTempList([]); //에러 발생 시 목록은 비우기
        })
        .fillally(()=>{
            setIsLoading(false);//로딩 끝.
        })
    }
    //테스트를 위해 주석 처리
    // useEffect(()=>{
    //     templateInfo();
    // },[])

   
    useEffect(() => {
    // 실제 서버 요청 주석 처리
    // templateInfo();

    // ✅ 임시 테스트용 더미 데이터 사용
        const dummyData = [
        { temp_no: 1, temp_name: "Template1", file_pypath: "/resources/html/test.html" },
        { temp_no: 2, temp_name: "Template1", file_pypath: "/resources/html/test2.html" },
        { temp_no: 3, temp_name: "Template1", file_pypath: "/resources/html/test3.html" },
        { temp_no: 4, temp_name: "Template1", file_pypath: "/resources/html/test-template.html" },
        { temp_no: 5, temp_name: "Template1", file_pypath: "/resources/html/test-template 2.html" },
        { temp_no: 6, temp_name: "Template1", file_pypath: "/resources/html/test-template 3.html" },
        { temp_no: 7, temp_name: "Template1", file_pypath: "/resources/html/example.html" },
        { temp_no: 8, temp_name: "Template1", file_pypath: "/resources/html/example2.html" },
        { temp_no: 9, temp_name: "Template1", file_pypath: "/resources/html/example-template.html" },
        { temp_no: 10, temp_name: "Template1", file_pypath: "/test.html" },
        { temp_no: 11, temp_name: "Template1", file_pypath: "/test.html" },
        { temp_no: 12, temp_name: "Template1", file_pypath: "/test.html" },
        { temp_no: 13, temp_name: "Template1", file_pypath: "/test.html" },
    ];
    setTempList(dummyData);
    }, []);


    return(
        <div className="template-selection-container">
            <h2>템플릿 선택</h2>
            {isLoading && <p>템플릿을 불러오는 중...</p>}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && !tempList.length===0 && (
                <p>선택 가능한 템플릿이 없습니다.</p>)}
            <TemplateSlider tempList={tempList} />
        </div>
    )



};

export default TemplateSelection;