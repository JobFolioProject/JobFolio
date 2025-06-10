import { useState } from "react";
import "../../css/resume/Resume.css";

const Resume = () => {
  const [userInfo, setUserInfo] = useState({});

  return (
    <div className="resume">
      <h1>이력서 페이지 입니다.</h1>
    </div>
  );
};

export default Resume;
