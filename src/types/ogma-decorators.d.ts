import type { Node } from "@linkurious/ogma";

declare module "@linkurious/ogma" {
  interface Node {
    addDecorator(options: {
      id: string;
      radius?: number;
      color?: string;
      stroke?: { color: string; width: number };
      position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
      text?: {
        content: string;
        color?: string;
        scale?: number;
        font?: string;
      };
    }): void;
  }
}
