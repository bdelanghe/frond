import { parse, print } from "https://deno.land/x/swc@0.2.1/mod.ts";
// Removed explicit type imports from swc as they are not exported

// Helper function to get SWC parse options based on file path
function getParseOptions(filePath: string): any {
  const isTypeScript = filePath.endsWith(".ts") || filePath.endsWith(".tsx");
  const isTsx = filePath.endsWith(".tsx");
  const isJsx = filePath.endsWith(".jsx");

  let parseOptions: any;

  if (isTypeScript) {
    parseOptions = {
      syntax: "typescript",
      tsx: isTsx,
      decorators: true,
      comments: true,
      target: "es2022",
      // isModule: true, // Default
    };
  } else {
    parseOptions = {
      syntax: "ecmascript",
      jsx: isJsx,
      comments: true,
      target: "es2022",
      // isModule: true, // Default
    };
  }
  return parseOptions;
}


/**
 * Parses the given source text using SWC, serializes the AST to JSON,
 * and saves it to the specified JSON file path.
 *
 * @param sourceText The original source code.
 * @param sourceFilePath The path to the original source file (used for context).
 * @param astJsonPath The path where the serialized AST JSON should be saved.
 */
export async function generateAndSaveAst(
  sourceText: string,
  sourceFilePath: string,
  astJsonPath: string,
): Promise<void> {
  const parseOptions = getParseOptions(sourceFilePath);
  const originalAst = await parse(sourceText, parseOptions);

  // Serialize the AST to a JSON string with indentation for readability
  const serializedAst = JSON.stringify(originalAst, null, 2); // Added indentation

  // Save the serialized AST to the specified file
  await Deno.writeTextFile(astJsonPath, serializedAst);
  console.log(`AST saved to: ${astJsonPath}`); // Added log
}


/**
 * Reads a serialized AST from a JSON file, deserializes it,
 * regenerates the code from the AST, and returns the regenerated source text.
 *
 * @param astJsonPath The path to the file containing the serialized AST JSON.
 * @returns The regenerated source code.
 */
export async function printFromAstJson(
  astJsonPath: string,
): Promise<string> {
  // Read the serialized AST from the file
  const serializedAst = await Deno.readTextFile(astJsonPath);

  // Deserialize the JSON string back into an AST object
  const rehydratedAst: any = JSON.parse(serializedAst);

  // Regenerate the code from the rehydrated AST
  const printOptions = {
    // Keep defaults for now
  };

  const { code: regeneratedSource } = await print(rehydratedAst, printOptions);

  // Return the regenerated source code
  return regeneratedSource;
}
