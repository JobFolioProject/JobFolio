const PersonalInfoModify = ({ resumeInfo, setResumeInfo }) => {
  return (
    <>
      <label>
        <div>
          <span>
            제목<span className="required-mark">*</span>
          </span>
        </div>
        <div>
          <input
            type="text"
            name="title"
            value={resumeInfo.title}
            onChange={(e) => {
              setResumeInfo({
                ...resumeInfo,
                title: e.target.value,
              });
            }}
          />
        </div>
      </label>
      <label>
        <div>
          <span>
            이름<span className="required-mark">*</span>
          </span>
        </div>
        <div>
          <input
            type="text"
            name="name"
            value={resumeInfo.name}
            onChange={(e) => {
              setResumeInfo({
                ...resumeInfo,
                name: e.target.value,
              });
            }}
          />
        </div>
      </label>
      <label>
        <div>
          <span>
            이메일<span className="required-mark">*</span>
          </span>
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={resumeInfo.email}
            onChange={(e) => {
              setResumeInfo({
                ...resumeInfo,
                email: e.target.value,
              });
            }}
          />
        </div>
      </label>
      <label>
        <div>
          <span>
            전화번호<span className="required-mark">*</span>
          </span>
        </div>
        <div>
          <input
            type="text"
            name="phoneNum"
            value={resumeInfo.phone}
            onChange={(e) => {
              setResumeInfo({
                ...resumeInfo,
                phone: e.target.value,
              });
            }}
          />
        </div>
      </label>
    </>
  );
};

export default PersonalInfoModify;
