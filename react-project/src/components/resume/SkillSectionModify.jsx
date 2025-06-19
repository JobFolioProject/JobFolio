import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import DropDown from "./ResumeDropdown";
const SkillSectionModify = ({ resumeInfo, setResumeInfo }) => {
  const [groupCodeList, setGroupCodeList] = useState([]);
  const [selectedGroupCode, setSelectedGroupCode] = useState("");

  useEffect(() => {
    const selectedByDetailCode = async () => {
      const newGroupCode = {};
      for (const skill of resumeInfo.skills) {
        axios
          .get("/api/resume/selectedOneGroupCode", {
            params: {
              detail_code: skill.skill_code,
            },
          })
          .then((res) => {
            console.log(skill.skill_code);
            newGroupCode[skill.skill_code] = res;
            console.log(newGroupCode[skill.skill_code]);
          })
          .catch((err) => {
            console.error(err);
          });

        setSelectedGroupCode(newGroupCode);
      }
    };
    selectedByDetailCode();
  }, []);

  useEffect(() => {
    const getGroupCode = async () => {
      await axios
        .get("/api/resume/selectSkillGroupCode")
        .then((res) => {
          setGroupCodeList(res);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    getGroupCode();
  }, []);
  return (
    <>
      <button
        className="addrBtn"
        onClick={() => {
          setResumeInfo({
            ...resumeInfo,
            skills: [
              ...resumeInfo.skills,
              {
                skill_code: "",
                group_code: "",
                exp_level: "",
                skill_tool: "",
              },
            ],
          });
        }}
      >
        {" "}
        기술스택 추가
      </button>
      {resumeInfo.skills.map((skill, index) => (
        <div className="toggleInput" key={index}>
          <div>
            <label>스킬명</label>
            <DropDown
              options={groupCodeList}
              placeholder={"직무 선택"}
              selected={selectedGroupCode[skill.skill_code] || ""}
            />
            <input
              type="text"
              value={skill.skill_code}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  skills: resumeInfo.skills.map((item, idx) =>
                    idx === index
                      ? { ...item, skill_code: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </div>

          <div>
            <label>숙련도</label>
            <input
              type="text"
              value={skill.exp_level}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  skills: resumeInfo.skills.map((item, idx) =>
                    idx === index
                      ? { ...item, exp_level: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </div>
          <div>
            <label>툴</label>
            <input
              type="text"
              value={skill.skill_tool}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  skills: resumeInfo.skills.map((item, idx) =>
                    idx === index
                      ? { ...item, skill_tool: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </div>
          <button
            className="deleteCareerBtn"
            onClick={() => {
              setResumeInfo({
                ...resumeInfo,
                skills: resumeInfo.skills.filter((_, idx) => idx !== index),
              });
            }}
          >
            삭제
          </button>
        </div>
      ))}
    </>
  );
};

export default SkillSectionModify;
