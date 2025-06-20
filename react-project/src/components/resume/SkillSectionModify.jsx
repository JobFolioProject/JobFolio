import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import DropDown from "./ResumeDropdown";
const SkillSectionModify = ({ resumeInfo, setResumeInfo }) => {
  const [groupCodeList, setGroupCodeList] = useState([]);
  const [detailCodeList, setDetailCodeList] = useState({});
  const skillLevelList = ["하", "중", "상"];
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

  useEffect(() => {
    const getDetailCode = async () => {
      const result = {};
      await Promise.all(
        resumeInfo.skills.map(async (skill) => {
          if (skill.group_code) {
            await axios
              .get("/api/resume/selectSkillDetailCode", {
                params: { group_code: skill.group_code },
              })
              .then((res) => {
                result[skill.group_code] = res;
              })
              .catch((err) => {
                console.error(err);
              });
          }
        })
      );
      setDetailCodeList(result);
    };
    getDetailCode();
  }, []);

  const handleGroupCodeChange = async (index, group_code) => {
    await axios
      .get("/api/resume/selectSkillDetailCode", {
        params: { group_code: group_code },
      })
      .then((res) => {
        setDetailCodeList((prev) => ({
          ...prev,
          [group_code]: res,
        }));
      })
      .catch((err) => {
        console.error(err);
      });

    setResumeInfo((prev) => ({
      ...prev,
      skills: prev.skills.map((item, idx) =>
        idx === index ? { ...item, group_code, skill_code: "" } : item
      ),
    }));
  };

  const handleDetailCodeChange = (index, skill_code) => {
    setResumeInfo((prev) => ({
      ...prev,
      skills: prev.skills.map((item, idx) =>
        idx === index ? { ...item, skill_code } : item
      ),
    }));
  };

  const handleSkillLevelChange = (index, exp_level) => {
    setResumeInfo((prev) => ({
      ...prev,
      skills: prev.skills.map((item, idx) =>
        idx === index ? { ...item, exp_level } : item
      ),
    }));
  };

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
          <div className="skill_dropdown">
            <label>스킬</label>
            <DropDown
              options={groupCodeList}
              placeholder={"직무분야 선택"}
              selected={skill.group_code || ""}
              onSelect={(value) => handleGroupCodeChange(index, value)}
            />
            {skill.group_code && (
              <DropDown
                options={detailCodeList[skill.group_code]}
                placeholder={"스킬 선택"}
                selected={skill.skill_code || ""}
                onSelect={(value) => handleDetailCodeChange(index, value)}
              />
            )}
            {skill.skill_code && (
              <DropDown
                options={skillLevelList}
                placeholder={"숙련도 선택"}
                selected={skill.exp_level || ""}
                onSelect={(value) => handleSkillLevelChange(index, value)}
              />
            )}
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
        </div>
      ))}
    </>
  );
};

export default SkillSectionModify;
