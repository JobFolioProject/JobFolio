const EduSectionModify = ({ resumeInfo, setResumeInfo }) => {
  return (
    <>
      <button
        className="addrBtn"
        onClick={() => {
          setResumeInfo({
            ...resumeInfo,
            education: [
              ...resumeInfo.education,
              {
                school_name: "",
                enroll_date: "",
                grad_date: "",
                edu_status: "",
                major: "",
                sub_major: "",
                gpa: "",
                notes: "",
              },
            ],
          });
        }}
      >
        {" "}
        학력사항 추가
      </button>
      {resumeInfo.education.map((edu, index) => (
        <div className="toggleInput" key={index}>
          <label>
            <div>학교명</div>
            <input
              type="text"
              value={edu.school_name}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
                    idx === index
                      ? { ...item, school_name: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </label>

          <label>
            <div>입학날짜</div>
            <input
              type="text"
              value={edu.enroll_date}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
                    idx === index
                      ? { ...item, enroll_date: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>졸업날짜</div>
            <input
              type="text"
              value={edu.grad_date}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
                    idx === index
                      ? { ...item, grad_date: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>학력상태</div>
            <input
              type="text"
              value={edu.edu_status}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
                    idx === index
                      ? { ...item, edu_status: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>전공</div>
            <input
              type="text"
              value={edu.major}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
                    idx === index ? { ...item, major: e.target.value } : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>부전공</div>
            <input
              type="text"
              value={edu.sub_major}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
                    idx === index
                      ? { ...item, sub_major: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>학점</div>
            <input
              type="text"
              value={edu.gpa}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
                    idx === index ? { ...item, gpa: e.target.value } : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>특이사항</div>
            <input
              type="text"
              value={edu.notes}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
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
                education: resumeInfo.education.filter(
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
export default EduSectionModify;
