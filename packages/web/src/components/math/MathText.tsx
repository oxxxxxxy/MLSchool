import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  // Regex for $$display$$ and $inline$
  const renderFormattedText = (rawText: string) => {
    // Split by $$...$$ or $...$
    const parts = rawText.split(/(\$\$[\s\S]*?\$\$|\$[^\$]*?\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2);
        try {
          const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="my-2 block text-center" />;
        } catch {
          return <span key={index}>{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const formula = part.slice(1, -1);
        try {
          const html = katex.renderToString(formula, { displayMode: false, throwOnError: false });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="inline-block mx-0.5" />;
        } catch {
          return <span key={index}>{part}</span>;
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  return <span className={className}>{renderFormattedText(text)}</span>;
};
