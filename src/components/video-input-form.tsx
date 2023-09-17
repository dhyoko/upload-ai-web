import { FC, ChangeEvent, useState, useMemo, FormEvent, useRef } from 'react';
import { FileVideo, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getFFmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { api } from '@/lib/axios';
import { VIDEO_INPUT_SUBMIT_STATUS, InputSubmitStatus } from './utils/consts';

type VideoInputFormProps = {
  onVideoUploaded: (id: string) => void;
};

export const VideoInputForm: FC<VideoInputFormProps> = (props) => {
  const { onVideoUploaded } = props;
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<InputSubmitStatus>(
    VIDEO_INPUT_SUBMIT_STATUS.WAITING
  );
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    const selectedFile = files[0];
    setVideoFile(selectedFile);
  };

  const convertVideoToAudio = async (video: File) => {
    console.log('Convert started');

    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile('input.mp4', await fetchFile(video));

    ffmpeg.on('progress', (progress) => {
      console.log(`Convert progress: ${Math.round(progress.progress * 100)}`);
    });

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ]);

    const data = await ffmpeg.readFile('output.mp3');
    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    });

    console.log('Convert Finished');

    return audioFile;
  };

  const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(VIDEO_INPUT_SUBMIT_STATUS.CONVERTING);

    const prompt = promptInputRef.current?.value;

    if (!videoFile) {
      return;
    }

    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();

    data.append('file', audioFile);

    setStatus(VIDEO_INPUT_SUBMIT_STATUS.UPLOADING);

    const response = await api.post('/videos', data);

    setStatus(VIDEO_INPUT_SUBMIT_STATUS.GENERATING);

    const videoId = response.data.video.id;

    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    });

    setStatus(VIDEO_INPUT_SUBMIT_STATUS.SUCCESS);
    onVideoUploaded(videoId);
  };

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }
    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  const isDisabled = useMemo(() => {
    return status !== VIDEO_INPUT_SUBMIT_STATUS.WAITING;
  }, [status]);

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="e-4 h-4" />
            Select your video
          </>
        )}
      </label>
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />
      <Separator />
      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Transcription prompt</Label>
        <Textarea
          id="transcription_prompt"
          className="h-20 leading-relaxed"
          placeholder="Please include key-words separated by comma (,)."
          ref={promptInputRef}
          disabled={isDisabled}
        />
      </div>
      <Button
        data-success={status === VIDEO_INPUT_SUBMIT_STATUS.SUCCESS}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400 data-[success=true]:text-black"
        disabled={isDisabled}
      >
        {!isDisabled ? (
          <>
            Upload your video
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) : (
          status
        )}
      </Button>
    </form>
  );
};
