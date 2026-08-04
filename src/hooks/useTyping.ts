"use client";

import { useEffect, useState } from "react";

export function useTyping(
  words: string[],
  { typeMs = 70, deleteMs = 35, holdMs = 1900 } = {},
): string {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex === word.length) {
      timeout = setTimeout(() => setDeleting(true), holdMs);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(
        () => setCharIndex((c) => c + (deleting ? -1 : 1)),
        deleting ? deleteMs : typeMs,
      );
    }
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, typeMs, deleteMs, holdMs]);

  return words[wordIndex % words.length].slice(0, charIndex);
}
