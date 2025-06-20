import '../../css/mainPage/Main4th.css';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const jobList = [
  {
    title: "우희민",
    company: "JobFolio",
    location: "서울 구로구",
    experience: "Project Manager",
    image: "ir.png"
  },
  {
    title: "엄희윤",
    company: "JobFolio",
    location: "서울 구로구",
    experience: "Project Leader",
    image: "ir.png"
  },
  {
    title: "임수경",
    company: "JobFolio",
    location: "서울 구로구",
    experience: "Project Member",
    image: "ir.png"
  },
  {
    title: "이현명",
    company: "JobFolio",
    location: "서울 구로구",
    experience: "Project Member",
    image: "ir.png"
  },
  {
    title: "이채은",
    company: "JobFolio",
    location: "서울 구로구",
    experience: "Project Member",
    image: "ir.png"
  },
  {
    title: "김용현",
    company: "JobFolio",
    location: "서울 구로구",
    experience: "Project Member",
    image: "ir.png"
  },
  {
    title: "최호철",
    company: "JobFolio",
    location: "서울 구로구",
    experience: "Project Member",
    image: "ir.png"
  },
  {
    title: "조아라",
    company: "JobFolio",
    location: "서울 구로구",
    experience: "Project Member",
    image: "ir.png"
  },
  {
    title: "김민혁",
    company: "JobFolio",
    location: "서울 구로구",
    experience: "Project Member",
    image: "ir.png"
  }
];
const Main4th = () => {
return (
  <div className='main-4th'>
    <div className="job-section">
      <div className="job-header">
        <h2>Project Member</h2>
        </div>
        <div className="job-list">
          {jobList.map((job, idx) => (
            <div className="job-card" key={idx}>
              <AccountCircleIcon className='circleIcon' fontSize="large"/>
              <div className="job-info">
                <h4>{job.title}</h4>
                <p>{job.company}</p>
                <p className="location">{job.location} · {job.experience}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main4th;