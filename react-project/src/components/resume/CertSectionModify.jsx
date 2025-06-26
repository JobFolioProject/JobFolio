import SingleCalendar from "../common/SingleCalendar";

const CertSectionModify = ({ resumeInfo, setResumeInfo }) => {
  const handleCertDateChange = (index, field, date) => {
    setResumeInfo({
      ...resumeInfo,
      certifications: resumeInfo.certifications.map((item, idx) =>
        idx === index ? { ...item, [field]: date ? date : null } : item
      ),
    });
  };
  return (
    <>
      <button
        className="addrBtn"
        onClick={() => {
          if (resumeInfo.certifications.length >= 4) {
            alert("자격증은 최대 4개까지 입력 가능합니다");
            return;
          }
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
          <div>
            <label>
              자격증 번호 <span className="required-mark">*</span>
            </label>
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
          </div>

          <div>
            <label>
              자격증명 <span className="required-mark">*</span>
            </label>
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
          </div>
          <div>
            <label>
              발행기관 <span className="required-mark">*</span>
            </label>
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
          </div>
          <div>
            <label>
              취득일 <span className="required-mark">*</span>
            </label>
            <SingleCalendar
              selectedDate={
                cert.acquired_date ? new Date(cert.acquired_date) : null
              }
              onChangeDate={(date) =>
                handleCertDateChange(index, "acquired_date", date)
              }
              placeholder={"취득일"}
            />
          </div>
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
