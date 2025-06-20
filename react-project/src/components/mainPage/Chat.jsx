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
        <>
        </>
    );
};

export default Chat;
