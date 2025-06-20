import React, { useEffect } from 'react';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

const Chat = () => {
    useEffect(() => {

        ChannelService.loadScript();
        
        if (window.ChannelIO) {
            window.ChannelIO('boot', {
                "pluginKey": process.env.REACT_APP_CHAT_PLUGIN_KEY,  
            });
        } else {
            console.error('ChannelIO is not loaded.');
        }


        return () => {
            if (window.ChannelIO) {
                window.ChannelIO('shutdown');
            }
        };
    }, []);

    return (
        <div>
            <p>채널톡이 초기화되었습니다. 채팅 버튼을 사용하세요.</p>
        </div>
    );
};

export default Chat;
