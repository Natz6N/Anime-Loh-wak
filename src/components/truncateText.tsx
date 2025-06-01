import React from "react";

interface TruncateTextProps {
  text: string;
  maxChars?: number;
  maxLines?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements; // menentukan tag HTML yang akan digunakan (e.g., 'p', 'h1', 'h2')
} 

const TruncateText: React.FC<TruncateTextProps> = ({
  text,
  maxChars,
  maxLines,
  className = "",
  as: Tag = "p", // default-nya adalah <p>
}) => {
  let displayText = text;

  if (maxChars && text.length > maxChars) {
    displayText = text.substring(0, maxChars).trim() + "...";
  }

  const lineClampClass = maxLines ? `line-clamp-${maxLines}` : "";

  return (
    <Tag className={`text-ellipsis overflow-hidden ${lineClampClass} ${className}`}>
      {displayText}
    </Tag>
  );
};

export default TruncateText;
