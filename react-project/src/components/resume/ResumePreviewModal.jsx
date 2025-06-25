import React, { use, useState, useEffect, useCallback} from 'react';
import ReactDOM from 'react-dom';
import Loading from '../common/Loading';
import axios from "../../utils/axiosConfig";
import '../../css/resume/ResumePreviewModal.css';
import { faL } from '@fortawesome/free-solid-svg-icons';

const ResumePreviewModal = ({ open, onClose, loading, setLoading, htmlString, setHtmlString, formData }) => {

    const [download, setDownload] = useState(false);
    const [filePath, setFilePath] = useState("");

    const insertResume = async () =>{
        setLoading(!loading);
        setDownload(true);
        const dataToSend = {
            ...formData,
            htmlString: htmlString
        };
        try {
                const res = await axios.post('/api/resume/insertResumeInfo', 
                    dataToSend
                );
                if (res.result === 1) {
                const path = res.filePath;
                setFilePath(path);
                alert('이력서 저장이 완료되었습니다');
                return path;       // ← 여기서 반드시 리턴!
                } else {
                alert('이력서 저장에 실패했습니다.');
                throw new Error('저장 실패');
                }
            } catch (err) {
                console.error(err);
                throw err;
            } finally {
                setLoading(false);
            }

    };

    const pdfSubmit = async(usedFilePath) =>{
        try {
            const pathToUse = usedFilePath || filePath;
            const res = await axios.post(
            '/api/resume/exportPdf',
            { filePath: pathToUse },
            { responseType: 'arraybuffer', maxBodyLength: Infinity }
            );
            const blob = new Blob([res], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();

            setFilePath('');
            setDownload(false);
        } catch (err) {
            console.error(err.response || err);
            alert('PDF 다운로드 중 오류가 발생했습니다.');
        }
    };

    //이력서 저장 및 PDF로 저장
    const pdfDownload = async () => {
        try {
            if (!download) {
            const newPath = await insertResume();
            //  await new Promise(r => setTimeout(r, 1000));
            await pdfSubmit(newPath);
            } else {
                await pdfSubmit();
            }
            setDownload(false);
            close();
        } catch (err) {
            // 이미 내부에서 alert 처리하므로 별도 처리 생략 가능
        }
    };
    
    const close = () =>{
        setHtmlString("");
        setDownload(false);
        onClose(false);
    }


    if(!open){return null;}

  return (
    <>
    <div className="modal-overlay">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={()=>onClose(false)}>&times;</button>
        <iframe
            title="이력서 미리보기"
            srcDoc={htmlString}
            style={{ width: '100%', height: '80vh', border: 'none' }}
          />
          <div className="buttonRow">
            {download ? (
                <button className="secondaryBtn" type='button' onClick={pdfDownload}>
                    PDF 다운로드
                </button>
            ):(
                <>
                    <button className="secondaryBtn" type='button' onClick={insertResume}>
                        이력서 저장
                    </button>
                    <button className="secondaryBtn" type='button' onClick={pdfDownload}>
                        이력서 저장 및 PDF 다운로드
                    </button>
                </>
            )}
          <button className="modal-close secondaryBtn" onClick={close}>
            닫기
          </button>
        </div>
      </div>
    </div>
    <Loading loading={loading}></Loading>
    </>
  );

}

export default ResumePreviewModal;