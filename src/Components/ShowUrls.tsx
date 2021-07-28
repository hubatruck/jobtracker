import React from "react";
import sanitizeHtml from 'sanitize-html';

type ShowUrlsProps = {
    text: string;
    convertLinks: boolean;
}

export class ShowUrls extends React.Component<ShowUrlsProps> {
    render() {
        let text;
        if (this.props.convertLinks) {
            const urlRegex = /(http[s]?:\/\/[0-9a-zA-Z]+\.[a-zA-Z0-9]{2,})/;
            text = sanitizeHtml(this.props.text, {
                allowedTags: [],
                allowedAttributes: {},
                allowedIframeDomains: [],
            });
            text = text.replace(urlRegex, (url: string) => {
                const handler = process.env.REACT_APP_REDIRECT_DAEMON_URL || '';
                return ('<a target=\'_blank\' href="' + handler + url + '">' + url + '</a>');
            });

        } else {
            text = this.props.text;
        }
        return (<span dangerouslySetInnerHTML={{__html: text}}/>);
    }
}
