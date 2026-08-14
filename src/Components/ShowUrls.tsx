import { useMemo } from "react";
import sanitizeHtml from "sanitize-html";

type ShowUrlsProps = {
  text: string;
  convertLinks: boolean;
};

export const ShowUrls = ({ text, convertLinks }: ShowUrlsProps) => {
  const displayText = useMemo(() => {
    if (!convertLinks) {
      return text;
    }

    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/;
    let sanitized = sanitizeHtml(text, {
      allowedTags: [],
      allowedAttributes: {},
      allowedIframeDomains: [],
    });
    sanitized = sanitized.replace(
      urlRegex,
      (url: string) => `<a target='_blank' href="${url}">${url}</a>`,
    );

    return sanitized;
  }, [convertLinks, text]);

  return (
    <span
      style={{ whiteSpace: "pre-wrap" }}
      dangerouslySetInnerHTML={{ __html: displayText }}
    />
  );
};
