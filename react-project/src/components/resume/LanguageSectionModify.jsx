const LanguageSectionModify = ({ resumeInfo, setResumeInfo }) => {
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
          <label>
            <div>언어</div>
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
          </label>

          <label>
            <div>등급</div>
            <input
              type="text"
              value={lang.level}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  languages: resumeInfo.languages.map((item, idx) =>
                    idx === index ? { ...item, level: e.target.value } : item
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
