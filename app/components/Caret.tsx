import useGetElementAsync from "@/hooks/useGetElementAsync";
import React from "react";

type Props = {
  currentPosition: string;
};

function Caret({ currentPosition }: Props) {
  console.log(currentPosition);
  var element = useGetElementAsync("#word-" + currentPosition);

  const offset = {
    left: element?.offsetLeft ?? 0 + 3.6,
    top: element?.offsetTop ?? 0 + 5,
  };

  return (
    <div
      style={offset}
      className="text-[1.5rem] w-[0.1em] h-[1.2em] absolute animate-pulse bg-[#e2b714] origin-top-left block"
    />
  );
}

export default Caret;
