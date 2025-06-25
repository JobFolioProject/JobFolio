import React, { useState, useEffect, useCallback } from "react";
import axios from '../../../utils/axiosConfig';
import '../../../css/admin/adminComponents/GroupManagement.css';
import * as commonjs from "../../common/commonfunction.js";

const GroupDetailpopup = ({
  action,
  detailcode,
  detailclosemodal,
  group_code,
  title,
}) => {
  const [detaileditdata, setDetaileditdata] = useState({
    group_name: "",
    detail_code: "",
    detail_name: "",
    note: "",
    useyn: "Y",
    readonly: false,
  });

  const groupcodselect = async (groupcode) => {

    await axios
      .post("/api/admin/selectgroupcode", {groupcode})
      .then((res) => {
        console.log(res);
        //res.data.commcodeModel
        setDetaileditdata((prev) => ({
          ...prev,
          group_name: res.commcodeModel.group_name,
        }));
      })
      .catch((err) => {
        console.log("noticeUpdate catch start");
        alert(err.message);
      });
  };

  const detailcodselect = async (grpcd) => {

    const payload = {
        groupcode:  grpcd,
        detailcode: detailcode,
      };

      await axios
        .post("/api/admin/selectdetailcode", payload)
        .then((res) => {
          setDetaileditdata((prev) => ({
            ...prev,
            detail_code: res.commcodeModel.detail_code,
            detail_name: res.commcodeModel.detail_name,
            note: res.commcodeModel.note,
            useyn: res.commcodeModel.use_yn,
            readonly: true,
          }));
        })
        .catch((err) => {
          console.log("noticeUpdate catch start");
          alert(err.message);
        });
    }

  const save =async (flag) => {
    const checklist = [
      { inval: detaileditdata.detail_code, msg: "살세 코드를 입력해 주세요" },
      {
        inval: detaileditdata.detail_name,
        msg: "상세 코드 명를 입력해 주세요",
      },
    ];

    if (!commonjs.nullcheck(checklist)) return;

    const payload = {
    igroupcode:    group_code,
    idetailcode:    detaileditdata.detail_code,
    idetailname:         detaileditdata.detail_name,
    idnote:        detaileditdata.note,
    iduseyn: detaileditdata.useyn,
    action:        flag === "D" ? "D" : action
  };

    await axios
      .post("/api/admin/savedetailcode", payload)
      .then((res) => {
        console.log(res);

        if (res.result === "SUCCESS") {
          if (flag === "D") {
            alert("삭제 되었습니다.");
          } else {
            alert("저장 되었습니다.");
          }
        }

        closepop(true);
      })
      .catch((err) => {
        console.log("noticeUpdate catch start");
        alert(err.message);
      });
  };

  const del = () => {
    save("D");
  };

  const closepop = (flag) => {
    flag = flag || false;

    detailclosemodal(flag);
  };

  // onLoad
  useEffect(() => {
    groupcodselect(group_code);

    if (action === "I") {
      setDetaileditdata((prev) => ({
        ...prev,
        detail_code: "",
        detail_name: "",
        note: "",
        useyn: "Y",
        readonly: false,
      }));
    } else {
      detailcodselect(group_code);
    }
  }, [action, group_code, detailcode]);

  return (
    <table className="row modal-content">
      <colgroup>
        <col style={{ width: "20%" }} />
        <col />
        <col style={{ width: "20%" }} />
        <col />
      </colgroup>
      <tbody>
        <tr>
          <td colSpan={4}>
            <p className="conTitle">
              <span>{title}</span>
            </p>
          </td>
        </tr>
        <tr>
          <th style={{ padding: "30px" }}>그룹 코드</th>
          <td>
            <input
              type="text"
              id="group_code"
              name="group_code"
              value={group_code}
              readOnly
            />
          </td>
          <th style={{ padding: "30px" }}>그룹 코드 명</th>
          <td>
            <input
              type="text"
              id="group_name"
              name="group_name"
              value={detaileditdata.group_name}
              readOnly
            />
          </td>
        </tr>
        <tr>
          <th style={{ padding: "30px" }}>상세 코드</th>
          <td>
            <input
              type="text"
              id="detail_code"
              name="detail_code"
              value={detaileditdata.detail_code}
              readOnly={detaileditdata.readonly}
              onInput={(e) => {
                setDetaileditdata((prevdetaileditdata) => ({
                  ...prevdetaileditdata,
                  detail_code: e.target.value,
                }));
              }}
            />
          </td>
          <th style={{ padding: "30px" }}>상세 코드 명</th>
          <td>
            <input
              type="text"
              id="detail_name"
              name="detail_name"
              value={detaileditdata.detail_name}
              onInput={(e) => {
                setDetaileditdata((prevdetaileditdata) => ({
                  ...prevdetaileditdata,
                  detail_name: e.target.value,
                }));
              }}
            />
          </td>
        </tr>
        <tr>
          <th style={{ padding: "30px" }}>내용</th>
          <td colSpan={3}>
            <textarea
              id="note"
              name="note"
              value={detaileditdata.note}
              cols="20"
              rows="3"
              onChange={(e) => {
                setDetaileditdata((prevdetaileditdata) => ({
                  ...prevdetaileditdata,
                  note: e.target.value,
                }));
              }}
            ></textarea>
          </td>
        </tr>
        <tr>
          <th style={{ padding: "30px" }}>사용 유무</th>
          <td colSpan={3}>
            사용{" "}
            <input
              type="radio"
              id="usey"
              name="useyn"
              value="Y"
              checked={detaileditdata.useyn === "Y"}
              onChange={(e) => {
                setDetaileditdata((prevgroupeditdata) => ({
                  ...prevgroupeditdata,
                  useyn: e.target.value,
                }));
              }}
            />
            미사용{" "}
            <input
              type="radio"
              id="usen"
              name="useyn"
              value="N"
              checked={detaileditdata.useyn === "N"}
              onChange={(e) => {
                setDetaileditdata((prevgroupeditdata) => ({
                  ...prevgroupeditdata,
                  useyn: e.target.value,
                }));
              }}
            />
          </td>
        </tr>
        <tr>
          <td colSpan={4}>
            <div className="modal-button">
              <button onClick={save}> 저장 </button>
              <button onClick={del}> 삭제 </button>
              <button onClick={closepop}> 닫기 </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default GroupDetailpopup;
