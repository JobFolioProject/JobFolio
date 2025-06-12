import '../../css/common/Footer.css';

const Footer = () => {
    return(
        <footer>
            <div className="link">
            <div className="box title">
                J O B F O L I O
            </div>
            <div className="box">
                Learn
                <br /><br />
                <a href="/community/info">Introduction</a><br />
                <a href="/community/notice">Notice</a><br />
                <a href="/community/faq">Ask and Questions</a><br />
            </div>
            <div className="box">
                Resume
                <br /><br />
                <a href="/resume/write">Produce Resume </a><br/>
                <a href="/resume/edit">Update Resume</a><br/>
            </div>
            <div className="box">
                More
                <br/><br/>
                <a href="/pay">Buy Plan</a><br/>

            </div>
            <div className="box">
                Follow
                <br/><br/>
                <a href="https://instagram.com/_hy_eom">Instagram</a><br/>
                <a href="https://github.com/JobFolioProject/JobFolio">GitHub</a><br/>
                <a href="/">Discord</a><br/>
            </div>
            </div>
            <div className="policy">
            For web site terms of use, trademark policy and general project policies please see https://jobfolio.com
            </div>
            <div className="copywrite">
            CopyWrite @ 2025 JobFolioProject Foundation. All rights reserved
            </div>

        </footer>
    )
}
export default Footer;