import React from "react";

const TempManModal=({isModalOpen, onClose})=>{
    if(!isModalOpen)
        return null;
    return (
        <div
            role="presentation"
            className="modal-overlay"
            onClick={onClose}
        >

        </div>
    )
    // (
    //     <div className="modal-overlay" onClick={onClose}>
    //         <div className="modal-content" onClick={(e)=>e.stopPropagation()}>
    //             <h4>템플릿 모달</h4>
    //             <p>모달모달</p>
    //             <div>
    //                 <button onClick={onClose} style={{ marginRight: '10px' }}>저장</button>
    //                 <button onClick={onClose} style={{ marginRight: '10px' }}>취소</button>
    //             </div>
    //         </div>
    //     </div>
    // );
}

export default TempManModal;