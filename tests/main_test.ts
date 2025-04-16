import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";
// Import the new functions
import { generateAndSaveAst, printFromAstJson } from "../src/main.ts";

const TEMP_DIR = "./tests/temp";

// Helper to clean up temp files after tests
async function cleanupTempDir() {
  try {
    await Deno.remove(TEMP_DIR, { recursive: true });
    console.log(`Cleaned up temp directory: ${TEMP_DIR}`);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      console.error(`Error cleaning up temp directory: ${error}`);
    }
  }
}

// Ensure temp dir exists before running tests and clean up after
await ensureDir(TEMP_DIR);
Deno.addSignalListener("SIGINT", async () => {
  await cleanupTempDir();
  Deno.exit();
});


Deno.test("SWC formatting should be idempotent via saved AST", async (t) => {
  const fixturePath = "./tests/fixtures/simple.ts";
  const astJsonPath1 = `${TEMP_DIR}/simple.ast.json`;
  const astJsonPath2 = `${TEMP_DIR}/simple_pass2.ast.json`;

  await t.step("Generate, save, load, print twice and check idempotency", async () => {
    // First pass: src -> save AST -> print
    const originalSource = await Deno.readTextFile(fixturePath);
    await generateAndSaveAst(originalSource, fixturePath, astJsonPath1);
    const regeneratedSource1 = await printFromAstJson(astJsonPath1);

    // Second pass: regenerated1 -> save AST -> print
    await generateAndSaveAst(regeneratedSource1, fixturePath, astJsonPath2);
    const regeneratedSource2 = await printFromAstJson(astJsonPath2);

    // Assert idempotency
    assertEquals(
      regeneratedSource2,
      regeneratedSource1,
      "Printing from saved AST twice should produce identical output.",
    );
  });

  // Clean up specific files for this test
  await Deno.remove(astJsonPath1).catch(() => {});
  await Deno.remove(astJsonPath2).catch(() => {});
});

Deno.test("Complex TS fixture should be idempotent via saved AST", async (t) => {
  const fixturePath = "./tests/fixtures/complex.ts";
  const astJsonPath1 = `${TEMP_DIR}/complex.ast.json`;
  const astJsonPath2 = `${TEMP_DIR}/complex_pass2.ast.json`;

  await t.step("Generate, save, load, print twice and check idempotency", async () => {
    // First pass: src -> save AST -> print
    const originalSource = await Deno.readTextFile(fixturePath);
    await generateAndSaveAst(originalSource, fixturePath, astJsonPath1);
    const regeneratedSource1 = await printFromAstJson(astJsonPath1);

    // Second pass: regenerated1 -> save AST -> print
    await generateAndSaveAst(regeneratedSource1, fixturePath, astJsonPath2);
    const regeneratedSource2 = await printFromAstJson(astJsonPath2);

    // Assert idempotency
    assertEquals(
      regeneratedSource2,
      regeneratedSource1,
      "Printing complex fixture from saved AST twice should produce identical output.",
    );
  });

  // Clean up specific files for this test
  await Deno.remove(astJsonPath1).catch(() => {});
  await Deno.remove(astJsonPath2).catch(() => {});
});

// // Run cleanup after all tests (alternative to signal listener)
// // Note: This might not run if tests exit prematurely.
// globalThis.addEventListener("unload", async () => {
//   await cleanupTempDir();
// }); 
