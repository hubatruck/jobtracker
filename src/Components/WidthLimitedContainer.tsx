import React from 'react';

type ContentContainerProps = {
    maxWidth?: number;
    centered?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

const defaults: ContentContainerProps = {
    maxWidth: 1000,
    centered: true,
}

export class WidthLimitedContainer extends React.Component<ContentContainerProps, ContentContainerProps> {
    constructor(props: ContentContainerProps) {
        super(props);

        this.state = {
            ...this.props, ...defaults
        }
    }

    render() {
        return <div
            style={{
                maxWidth: this.state.maxWidth,
                margin: this.state.centered ? "0 auto" : "initial",
                ...this.state.style,
            }}
            className={this.props.className}
        > {this.props.children}</div>
    }
}
