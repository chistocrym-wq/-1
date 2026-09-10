export async function blobToWav(blob: Blob): Promise<Blob> {
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) throw new Error('Браузер не поддерживает обработку аудио.');

  const context = new AudioContextCtor();
  try {
    const source = await context.decodeAudioData(await blob.arrayBuffer());
    const targetRate = 16000;
    const sourceLength = source.length;
    const targetLength = Math.max(1, Math.round(sourceLength * targetRate / source.sampleRate));
    const wavBuffer = new ArrayBuffer(44 + targetLength * 2);
    const view = new DataView(wavBuffer);
    const writeString = (offset: number, value: string) => {
      for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
    };
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + targetLength * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, targetRate, true);
    view.setUint32(28, targetRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, targetLength * 2, true);

    const channels = Array.from({ length: source.numberOfChannels }, (_, i) => source.getChannelData(i));
    const ratio = source.sampleRate / targetRate;
    let offset = 44;
    for (let i = 0; i < targetLength; i++) {
      const position = i * ratio;
      const left = Math.min(Math.floor(position), sourceLength - 1);
      const right = Math.min(left + 1, sourceLength - 1);
      const fraction = position - left;
      let sample = 0;
      for (const channel of channels) sample += channel[left] * (1 - fraction) + channel[right] * fraction;
      sample /= channels.length || 1;
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
    return new Blob([wavBuffer], { type: 'audio/wav' });
  } finally {
    await context.close();
  }
}
