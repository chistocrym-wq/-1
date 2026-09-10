export async function blobToWav(blob: Blob): Promise<Blob> {
  // Keep the original MediaRecorder container. Some mobile browsers can
  // produce a playable recording whose browser-side WAV re-encoding is
  // accepted locally but rejected by transcription APIs. The server now
  // detects the real container from the bytes and sends the correct filename
  // and MIME type to the transcription API.
  return blob;
}
