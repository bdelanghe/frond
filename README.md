# JS/TS Roundtrip Validation with Deno and SWC

This project demonstrates a simple round-trip validation for JavaScript and TypeScript files using Deno and the SWC library.

## Goal

The main objective is to:

1.  Parse input `.ts` or `.js` files into an Abstract Syntax Tree (AST) using SWC.
2.  Regenerate source code from the AST using `swc_ecma_codegen`.
3.  Compare the original input source with the regenerated source to validate the parsing and code generation process.

## Technology Stack

*   **Runtime:** Deno (for running TypeScript/JavaScript)
*   **Parser/Compiler Toolkit:** SWC (leveraged via Rust)
*   **Tool Version Management:** mise

## Prerequisites

*   [mise](https://mise.jdx.dev/) installed.
*   Run `mise install` in the project root. This will install the correct versions of Deno and Rust as specified in `.mise.toml`.

## Usage

(Instructions to be added once the core logic is implemented) 

## Comparison: Deno (SWC) vs Rust (Rowan-based)

This project focuses initially on Deno/SWC, but understanding the landscape with Rust/Rowan is valuable:

| Goal                     | Deno (SWC)                | Rust (Rowan - *for comparison*) |
| :----------------------- | :------------------------ | :------------------------------ |
| Parse losslessly         | Yes                       | Yes                             |
| Emit valid source        | Yes (`swc_ecma_codegen`)  | Yes (`.to_string()` or custom)  |
| Preserve comments/trivia | Yes (with config)         | Yes (fully lossless)            |
| Round-trip testing       | Easy                      | Easy                            |
| Fully Rust-native        | Yes                       | Yes                             |
| Compare structures       | Typed AST via SWC         | Syntax trees via Rowan          |
| Standard emit tooling    | `.ts` → Biome/Prettier (opt) | `.rs` → `rustfmt`             |

## Why This Sets Up Frond

Establishing robust round-trip capabilities for both Deno (TS/JS via SWC) and potentially Rust serves as a strong foundation:

*   **Comparative Analysis:** Directly observe where the AST structures converge or differ between language ecosystems.
*   **Informed IR Design:** Define shared Intermediate Representations (IR) or common traits based on practical comparison, not just theoretical speculation.
*   **Ecosystem Nuances:** Gain a deeper understanding of how trivia (whitespace, comments) and token streams are handled across different, real-world language tooling systems.

## Potential Next Steps

With this foundation, we can explore:

*   A CLI scaffold for both systems (`frond-deno`, `frond-rust`) to manage the round-trip process.
*   A standardized test fixture format (e.g., `/tests/fixtures/example.ts` → regenerate → assert no difference).
*   A shared JSON representation to facilitate side-by-side debugging and comparison of the generated ASTs. 
