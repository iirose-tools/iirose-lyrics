declare module 'lrc-file-parser' {
  interface LyricLine {
    time: number;
    text: string;
  }

  interface LyricOptions {
    lyric?: string;
    onPlay?: (line: number, text: string) => any;
    onSetLyric?: (lines: LyricLine[]) => any;
    offset?: number;
  }

  class Lyric {
    constructor(options?: LyricOptions);

    public lines: LyricLine[];

    public play(currentTime?: number): void;
    public pause(): void;
    public setLyric(lyric: string | null): void;
  }

  export = Lyric;
}
