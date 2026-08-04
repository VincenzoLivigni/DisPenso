// FILE TYPESCRIPT PER LA DICHIARAZIONE DEI TIPI DA USARE PER IL GLOBAL.CSS
/// <reference types="nativewind/types" />

declare module '*.css' {
  const content: any;
  export default content;
}