const RadioSelectorModify = ({ toggleRadio }) => {
  return (
    <label>
      <div>
        <span>변경 필드 선택</span>
      </div>
      <div className="checkbox_list">
        <input type="radio" name="list" id="link" onChange={toggleRadio} />
        <label htmlFor="link">링크</label>

        <input type="radio" name="list" id="edu" onChange={toggleRadio} />
        <label htmlFor="edu">학력</label>
        <input type="radio" name="list" id="career" onChange={toggleRadio} />
        <label htmlFor="career">경력</label>
        <input type="radio" name="list" id="skill" onChange={toggleRadio} />
        <label htmlFor="skill">기술스택</label>
        <input type="radio" name="list" id="language" onChange={toggleRadio} />
        <label htmlFor="language">외국어 역량</label>
        <input
          type="radio"
          name="list"
          id="certification"
          onChange={toggleRadio}
        />
        <label htmlFor="certification">자격증</label>
        <input
          type="radio"
          name="list"
          id="cover_letter"
          onChange={toggleRadio}
        />
        <label htmlFor="cover_letter">자기소개서</label>
      </div>
    </label>
  );
};

export default RadioSelectorModify;
