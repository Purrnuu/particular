declare module 'randomcolor' {
  interface RandomColorOptions {
    hue?: string | number;
    luminosity?: 'bright' | 'light' | 'dark' | 'random';
    count?: number;
    seed?: number | string;
    format?: 'hsvArray' | 'hslArray' | 'hsl' | 'hsla' | 'rgbArray' | 'rgb' | 'rgba' | 'hex';
    alpha?: number;
  }

  function randomColor(options?: RandomColorOptions): string;
  function randomColor(options?: RandomColorOptions & { count: number }): string[];

  export = randomColor;
}
