const CertSectionModify = ({ resumeInfo, setResumeInfo }) => {
  return (
    <>
      <button
        className="addrBtn"
        onClick={() => {
          setResumeInfo({
            ...resumeInfo,
            certifications: [
              ...resumeInfo.certifications,
              {
                certificate_no: "",
                certificate_name: "",
                issuing_org: "",
                acquired_date: "",
                notes: "",
              },
            ],
          });
        }}
      >
        {" "}
        자격증 추가
      </button>
      {resumeInfo.certifications.map((cert, index) => (
        <div className="toggleInput" key={index}>
          <label>
            <div>자격증 번호</div>
            <input
              type="text"
              value={cert.certificate_no}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  certifications: resumeInfo.certifications.map((item, idx) =>
                    idx === index
                      ? { ...item, certificate_no: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </label>

          <label>
            <div>자격증명</div>
            <input
              type="text"
              value={cert.certificate_name}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  certifications: resumeInfo.certifications.map((item, idx) =>
                    idx === index
                      ? { ...item, certificate_name: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>발행기관</div>
            <input
              type="text"
              value={cert.issuing_org}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  certifications: resumeInfo.certifications.map((item, idx) =>
                    idx === index
                      ? { ...item, issuing_org: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>취득일</div>
            <input
              type="text"
              value={cert.acquired_date}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  certifications: resumeInfo.certifications.map((item, idx) =>
                    idx === index
                      ? { ...item, acquired_date: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>특이사항</div>
            <input
              type="text"
              value={cert.notes}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  certifications: resumeInfo.certifications.map((item, idx) =>
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
                certifications: resumeInfo.certifications.filter(
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
export default CertSectionModify;
