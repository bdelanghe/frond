// Import from a Deno standard library module
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

// Define a simple class
class Calculator {
    add(a: number, b: number): number {
        // A comment inside the method
        return a + b;
    }

    subtract(a: number, b: number): number {
        return a - b;
    }
}

// Instantiate and use the class
const calc = new Calculator();
const sum = calc.add(5, 3);
const difference = calc.subtract(10, 4);

// Use the imported function for an assertion (example)
assertEquals(sum, 8);
assertEquals(difference, 6);

console.log(`Sum: ${sum}, Difference: ${difference}`); 
