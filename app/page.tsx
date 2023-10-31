"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Caret from "./components/Caret";
import Word, { Status } from "./components/Word";
import useInterval from "@/hooks/useInterval";

function getWords(expectedWords: string[], typedWords: string[]) {
  return expectedWords.map((word, wordIndex) => {
    let state: Status[] = word.split("").map(() => "neutral");

    if (typedWords.length < wordIndex + 1) {
      return { word, state, isComplete: false, isFinished: false };
    }

    const currentWord = typedWords[wordIndex];

    typedWords[wordIndex]
      .split("")
      .map(
        (char, charIndex) =>
          (state[charIndex] =
            charIndex >= word.length
              ? "extra"
              : word[charIndex] === char
              ? "correct"
              : "incorrect"),
      );

    if (currentWord.length > word.length) {
      // overtyyped
      const overtyped = currentWord.slice(word.length);
      word += overtyped;
    }

    return {
      word,
      state,
      isComplete: !state.some((s) => s === "neutral"),
      isCorrect: state.every((s) => s === "correct"),
      isFinished: typedWords.length > wordIndex + 1,
      isCurrent: typedWords.length === wordIndex + 1,
    };
  });
}

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const [words, setWords] = useState<string[]>([]);

  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(30);
  const [wpm, setWpm] = useState(0);

  useInterval(() => {
    if (!isRunning) {
      return;
    }

    const newValue = timer - 1;
    if (newValue === -1) {
      setIsRunning(false);
      return;
    }

    const parsedWords = getWords(words, typedText.split(" "));
    const finishedWords = parsedWords.filter((x) => x.isCorrect).length;
    setWpm(finishedWords * 2); // time is 30 seconds, so double the amount of words you did = wpm

    setTimer(newValue);
  }, 1000);

  const reset = useCallback(() => {
    setTypedText("");
    setTimer(30);
    setIsRunning(false);

    fetch("/api/words")
      .then((res) => res.json())
      .then((data) => setWords(data));
  }, []);

  useEffect(() => {
    fetch("/api/words")
      .then((res) => res.json())
      .then((data) => setWords(data));
  }, []);

  let parsedWords = useMemo(
    () => getWords(words, typedText.split(" ")),
    [typedText, words],
  );

  function onInput(value: string) {
    if (!isRunning) {
      console.log("starting");
      setIsRunning(true);
    }

    if (timer === 0) {
      return;
    }

    setTypedText(value);
  }

  const currentWord = useMemo(
    () => parsedWords.find((w) => w.isCurrent),
    [parsedWords],
  );
  const currentIndex = useMemo(
    () =>
      currentWord?.isComplete
        ? currentWord?.state.length
        : currentWord?.state.findIndex((x) => x === "neutral"),
    [currentWord?.isComplete, currentWord?.state],
  );
  const caretPos = `${parsedWords.indexOf(currentWord!)}-${currentIndex ?? 0}`;

  return (
    <div className="max-w-7xl pt-8 items-center grid gap-2 grid-flow-row grid-rows-1 min-h-screen p-8 w-full">
      <div id="typingTest" className="relative">
        <div className="text-2xl font-[400] text-[#e2b714]">
          {timer}s - {wpm} WPM
        </div>
        <input
          type="text"
          className="opacity-0"
          value={typedText}
          onChange={(ev) => onInput(ev.currentTarget.value)}
          onBlur={(ev) => ev.currentTarget.focus()}
          autoFocus
        />
        <div id="wordsWrapper" className="h-[115px] overflow-hidden relative">
          <div
            id="words"
            className="flex text-[1.5rem] flex-wrap h-[156px] overflow-hidden w-full ml-[unset]"
          >
            {parsedWords.map(
              ({ word, state, isFinished, isCorrect }, index) => (
                <Word
                  index={index}
                  isIncomplete={isFinished && !isCorrect}
                  key={word}
                  word={word}
                  status={state}
                />
              ),
            )}
          </div>

          <Caret currentPosition={caretPos} />
        </div>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
