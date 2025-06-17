import { SyncLoader } from "react-spinners";

const Loading = ({ loading }) => {
  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <h3>잠시만 기다려주세요</h3>
            <SyncLoader color="#fff" />
          </div>
        </div>
      )}
    </>
  );
};

export default Loading;
