import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface FormulaViewProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export const FormulaView: React.FC<FormulaViewProps> = ({
  latex,
  displayMode = false,
  className = ''
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(latex, containerRef.current, {
          displayMode,
          throwOnError: false,
          output: 'htmlAndMathml'
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
      }
    }
  }, [latex, displayMode]);

  return <span ref={containerRef} className={`inline-block font-mono ${className}`} />;
};
