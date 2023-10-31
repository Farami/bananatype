import { readFileSync } from "fs";
import { NextResponse } from "next/server";

function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

export async function GET() {
  const fileContent = readFileSync(process.cwd() + "/app/english.txt", "utf8");

  const words = fileContent.split(/\r?\n/);

  return NextResponse.json(shuffleArray(words).slice(0, 50));
}
