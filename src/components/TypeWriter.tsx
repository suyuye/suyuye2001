'use client';

import { useEffect, useState } from 'react';

interface TypeWriterProps {
  strings: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export function TypeWriter({
  strings,
  className = '',
  typeSpeed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentString = strings[stringIndex];

    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (charIndex === 0) {
        setIsDeleting(false);
        setStringIndex((i) => (i + 1) % strings.length);
        return;
      }
      const timeout = setTimeout(() => {
        setDisplayText(currentString.substring(0, charIndex - 1));
        setCharIndex((i) => i - 1);
      }, deleteSpeed);
      return () => clearTimeout(timeout);
    }

    if (charIndex === currentString.length) {
      setIsPaused(true);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(currentString.substring(0, charIndex + 1));
      setCharIndex((i) => i + 1);
    }, typeSpeed);
    return () => clearTimeout(timeout);
  }, [charIndex, stringIndex, isDeleting, isPaused, strings, typeSpeed, deleteSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      <span className="ml-0.5 inline-block w-[2px] h-[1em] bg-primary align-middle animate-pulse" />
    </span>
  );
}
