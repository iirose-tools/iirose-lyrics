import Lyric from 'lrc-file-parser';

export class LyricView {
  private audioElement: HTMLAudioElement | null = this.getAudioElement();
  private lyricParser!: Lyric;

  public init(): void {
    if (this.audioElement) {
      const lyricElement = document.createElement('div');
      lyricElement.className = 'lyric';

      lyricElement.style.bottom = '64px';
      lyricElement.style.color = '#fff';
      lyricElement.style.fontSize = '16px';
      lyricElement.style.fontWeight = 'bold';
      lyricElement.style.padding = '10rem 0';
      lyricElement.style.pointerEvents = 'none';
      lyricElement.style.position = 'absolute';
      lyricElement.style.textAlign = 'center';
      lyricElement.style.textShadow =
        '1px 0#000,-1px 0#000,0 1px#000,0-1px#000';
      lyricElement.style.width = '100%';
      lyricElement.style.zIndex = '999999';

      const lyricLinePrevious = document.createElement('p');
      const lyricLineCurrent = document.createElement('p');
      const lyricLineNext = document.createElement('p');

      lyricLinePrevious.style.opacity = '0.5';
      lyricLinePrevious.style.paddingBottom = '0.75rem';

      lyricLineNext.style.opacity = '0.5';
      lyricLineNext.style.paddingTop = '0.75rem';

      lyricElement.append(lyricLinePrevious, lyricLineCurrent, lyricLineNext);
      document.body.appendChild(lyricElement);

      this.lyricParser = new Lyric({
        onPlay: (line, text) => {
          const { lines } = this.lyricParser;

          lyricLinePrevious.innerText = line > 0 ? lines[line - 1].text : '';
          lyricLineCurrent.innerText = text;
          lyricLineNext.innerText =
            line === lines.length - 1 ? '' : lines[line + 1].text;
        }
      });

      const onPlay = () => {
        lyricElement.style.display = '';
        this.lyricParser.play(this.getCurrentTime(this.audioElement!));
      };

      const onStop = () => {
        lyricElement.style.display = 'none';

        this.lyricParser.setLyric(null);
        this.lyricParser.pause();
      };

      this.audioElement.addEventListener('play', onPlay);
      this.audioElement.addEventListener('pause', onStop);
      this.audioElement.addEventListener('ended', onStop);
      this.audioElement.addEventListener('emptied', onStop);
    }
  }

  public loadLyric(lyric: string): void {
    this.lyricParser.setLyric(lyric);
    this.lyricParser.play(this.getCurrentTime(this.audioElement!));
  }

  private getAudioElement(): HTMLAudioElement | null {
    const shareMediaObj = document.getElementById('shareMediaObj');
    const shareMediaObjAudio = document.getElementById('shareMediaObjAudio');

    return shareMediaObj instanceof HTMLAudioElement
      ? shareMediaObj
      : shareMediaObjAudio instanceof HTMLAudioElement
      ? shareMediaObjAudio
      : null;
  }

  private getCurrentTime(audio: HTMLAudioElement): number {
    return Math.floor(audio.currentTime * 1000);
  }
}
