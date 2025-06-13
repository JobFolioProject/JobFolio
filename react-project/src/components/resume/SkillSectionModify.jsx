const SkillSectionModify = ({ resumeInfo, setResumeInfo }) => {
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
          <label>
            <div>스킬명</div>
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
          </label>

          <label>
            <div>숙련도</div>
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
          </label>
          <label>
            <div>툴</div>
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
          </label>
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
