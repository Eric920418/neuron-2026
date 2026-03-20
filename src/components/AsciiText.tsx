import { useState, useEffect, useRef } from 'react';

const ASCII_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:"<>?~';
const FULL_WIDTH_ASCII = 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ！＠＃＄％︿＆＊（）＿＋｛｝｜：＂＜＞？～';

function getRandomChar(originalChar: string) {
  if (originalChar === ' ') return ' ';
  if (originalChar.charCodeAt(0) > 255) {
    return FULL_WIDTH_ASCII[Math.floor(Math.random() * FULL_WIDTH_ASCII.length)];
  }
  return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
}

export default function AsciiText({ text, isHovered }: { text: string; isHovered: boolean }) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isHovered) {
      let iteration = 0;
      intervalRef.current = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              return getRandomChar(char);
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(intervalRef.current);
        }
        iteration += 1 / 3;
      }, 30);
    } else {
      clearInterval(intervalRef.current);
      setDisplayText(text);
    }
    return () => clearInterval(intervalRef.current);
  }, [isHovered, text]);

  return <span>{displayText}</span>;
}
