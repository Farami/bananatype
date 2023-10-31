import React from "react";
import Caret from "./Caret";
import classNames from "classnames";

type Status = "neutral" | "correct" | "incorrect" | "extra";

type Props = {
  index: number;
  word: string;
  status: Status[];
  isIncomplete: boolean;
};

function Word({ index, word, status, isIncomplete }: Props) {
  function getColor(index: number) {
    return {
      neutral: "#646669",
      correct: "#d1d0c5",
      incorrect: "#ca4754",
      extra: "#7e2a33",
    }[status[index]];
  }

  return (
    <div
      className={classNames("m-[.25em] text-[1.5rem] leading-[1rem] h-[27px]", {
        "underline decoration-red-600": isIncomplete,
      })}
    >
      {word.split("").map((char, i) => (
        <span id={`word-${index}-${i}`} style={{ color: getColor(i) }} key={i}>
          {char}
        </span>
      ))}

      <span id={`word-${index}-${word.length}`}></span>
    </div>
  );
}

export default Word;
export type { Status };
