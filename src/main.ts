import { sayHello } from "./greet";

function hello(compiler: string) {
   return `Hello from ${compiler}`;
}

console.log(hello("TypeScript"));
console.log(sayHello("TypeScript"));

