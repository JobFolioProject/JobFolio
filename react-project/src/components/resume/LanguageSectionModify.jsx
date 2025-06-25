const LanguageSectionModify = ({ resumeInfo, setResumeInfo }) => {
  const levelOptions = ["초급", "중급", "고급"];
  return (
    <>
      <button
        className="addrBtn"
        onClick={() => {
          setResumeInfo({
            ...resumeInfo,
            languages: [
              ...resumeInfo.languages,
              {
                language: "",
                level: "",
              },
            ],
          });
        }}
      >
        {" "}
        외국어 역량 추가
      </button>
      {resumeInfo.languages.map((lang, index) => (
        <div className="toggleInput" key={index}>
          <div>
            <label>
              언어 <span className="required-mark">*</span>
            </label>
            <input
              type="text"
              value={lang.language}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  languages: resumeInfo.languages.map((item, idx) =>
                    idx === index ? { ...item, language: e.target.value } : item
                  ),
                });
              }}
            />
          </div>

          <div>
            <label>
              등급 <span className="required-mark">*</span>
            </label>
            <select
              name="level"
              value={lang.level}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  languages: resumeInfo.languages.map((item, idx) =>
                    idx === index ? { ...item, level: e.target.value } : item
                  ),
                });
              }}
            >
              <option value="">레벨 선택</option>
              {levelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            className="deleteCareerBtn"
            onClick={() => {
              setResumeInfo({
                ...resumeInfo,
                languages: resumeInfo.languages.filter(
                  (_, idx) => idx !== index
                ),
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

export default LanguageSectionModify;
