import '../css/Main.css';
import MainPage from './mainPage/MainPage';
import Main2nd from './mainPage/Main2nd';
import Main3rd from './mainPage/Main3rd';
import Main4th from './mainPage/Main4th';
import MainEmail from './mainPage/MainEmail';
import Chat from './mainPage/Chat';
import MainMap from './mainPage/MainMap';

const Main = () => {
   
    return (
    <>
        <MainPage/>
        <Main2nd/>
        <Main3rd/>
        <Main4th/>
        <MainEmail/>
        <MainMap/>
        <Chat/>
    </>
    );
};

export default Main;