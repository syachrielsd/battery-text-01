// The Battery's Last Text to Its Charger
// Writes the phone battery's final text message to its charger, one line of
// plain text (1-200 characters), to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output when the env var is unset).
// Node 22, no dependencies. Deterministic: the line is fixed, not generated.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Winner from SCREENING.md (revised, candidate #13, 24/25):
// tightened setup (filler cut) and a sharper final-words payoff — the battery
// takes the 7am alarm DOWN with it, the dying-together image.
const LINE =
  "I waited all day while you charged the tablet, the earbuds, and her phone. I'm at 1%. Don't rush. I'm taking the 7am alarm down with me.";

function main(): void {
  if (LINE.length < 1 || LINE.length > 200) {
    throw new Error(
      `entry line must be 1-200 characters, got ${LINE.length}`,
    );
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry line must not be only white space");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry must be exactly one line of plain text");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");

  // Read back and verify what was written, byte for byte.
  const written = readFileSync(outPath, "utf8");
  if (written !== LINE) {
    throw new Error("verification failed: entry.txt does not match the line");
  }
  console.log(`wrote ${outPath} (${LINE.length} chars)`);
}

main();
