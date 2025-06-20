import React, { useEffect } from 'react';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

const Chat = () => {
    useEffect(() => {
        // 스크립트를 직접 로드하고 초기화
        ChannelService.loadScript();
        
        if (window.ChannelIO) {
            window.ChannelIO('boot', {
                "pluginKey": process.env.REACT_APP_CHAT_PLUGIN_KEY,  // 실제 pluginKey 사용
            });
        } else {
            console.error('ChannelIO is not loaded.');
        }

        // 컴포넌트 언마운트 시 shutdown 호출
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
