const PersonalInfoModify = ({ resumeInfo, setResumeInfo }) => {
  return (
    <>
      <label>
        <div>
          <span>이름</span>
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
          <span>희망직무</span>
        </div>
        <div>
          <input
            type="text"
            name="position"
            value={resumeInfo.desired_position}
            onChange={(e) => {
              setResumeInfo({
                ...resumeInfo,
                desired_position: e.target.value,
              });
            }}
          />
        </div>
      </label>
      <label>
        <div>
          <span>주소</span>
        </div>
        <div>
          <input
            type="text"
            name="address"
            value={resumeInfo.address}
            onChange={(e) => {
              setResumeInfo({
                ...resumeInfo,
                address: e.target.value,
              });
            }}
          />
        </div>
      </label>
      <label>
        <div>
          <span>이메일</span>
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
          <span>전화번호</span>
        </div>
        <div>
          <input
            type="text"
            name="phoneNum"
            value={resumeInfo.hp}
            onChange={(e) => {
              setResumeInfo({
                ...resumeInfo,
                hp: e.target.value,
              });
            }}
          />
        </div>
      </label>
    </>
  );
};

export default PersonalInfoModify;
