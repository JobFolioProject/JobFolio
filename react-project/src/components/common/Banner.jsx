import "../../css/common/Banner.css";

const Banner = ( {pageName} ) => {
    return(
       <div className="banner">
            <img src="/resources/img/banner.png" alt="banner" />
            <video 
            className="banner-video"
            src="/resources/img/banner.mp4" autoPlay muted playsInline/>
            <div className="banner-text">
                <h1>{pageName}</h1>
            </div>
        </div>
    );
}
export default Banner;