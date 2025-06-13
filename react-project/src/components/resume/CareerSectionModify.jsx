const CareerSectionModify = ({ resumeInfo, setResumeInfo }) => {
  return (
    <>
      <button
        className="addrBtn"
        onClick={() => {
          setResumeInfo({
            ...resumeInfo,
            career: [
              ...resumeInfo.career,
              {
                company_name: "",
                start_date: "",
                end_date: "",
                position: "",
                notes: "",
              },
            ],
          });
        }}
      >
        {" "}
        경력사항 추가
      </button>
      {resumeInfo.career.map((career, index) => (
        <div className="toggleInput" key={index}>
          <label>
            <div>회사명</div>
            <input
              type="text"
              value={career.company_name}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  career: resumeInfo.career.map((item, idx) =>
                    idx === index
                      ? { ...item, company_name: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </label>

          <label>
            <div>입사일</div>
            <input
              type="text"
              value={career.start_date}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  career: resumeInfo.career.map((item, idx) =>
                    idx === index
                      ? { ...item, start_date: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>퇴사일</div>
            <input
              type="text"
              value={career.end_date}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  career: resumeInfo.career.map((item, idx) =>
                    idx === index ? { ...item, end_date: e.target.value } : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>직무</div>
            <input
              type="text"
              value={career.position}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  career: resumeInfo.career.map((item, idx) =>
                    idx === index ? { ...item, position: e.target.value } : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>특이사항</div>
            <input
              type="text"
              value={career.notes}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  career: resumeInfo.career.map((item, idx) =>
                    idx === index ? { ...item, notes: e.target.value } : item
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
                career: resumeInfo.career.filter((_, idx) => idx !== index),
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

export default CareerSectionModify;
