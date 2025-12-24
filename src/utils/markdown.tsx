import React from 'react';

export function parseMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n\n');

  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const content = parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-bold">{boldText}</strong>;
      }
      return part;
    });

    return (
      <span key={lineIndex}>
        {content}
        {lineIndex < lines.length - 1 && <><br /><br /></>}
      </span>
    );
  });
}
