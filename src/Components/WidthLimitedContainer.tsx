import React, { type ReactNode } from "react";

type ContentContainerProps = {
  maxWidth?: number;
  centered?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children?: ReactNode;
};

const defaults: ContentContainerProps = {
  maxWidth: 1000,
  centered: true,
};

export const WidthLimitedContainer = ({
  className,
  maxWidth,
  centered,
  style,
  children,
}: ContentContainerProps = defaults) => (
  <div
    style={{
      maxWidth,
      margin: centered ? "0 auto" : "initial",
      ...style,
    }}
    className={className}
  >
    {children}
  </div>
);
