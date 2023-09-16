import { Github, FileVideo, Upload, Wand2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './components/ui/select';
import { Slider } from './components/ui/slider';

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 pv-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Developed with ❤ on Rocketseat's NLW
          </span>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
        </div>
      </div>
      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Please include the prompt for the AI"
            />
            <Textarea placeholder="AI analysis result" readOnly />
          </div>
          <p className="text-sm text-muted-foreground">
            Remember you can use
            <code className="text-violet-400">{'{transcription}'}</code>
            variable in your prompt to add the content of transcriptions to the
            selected video
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label
              htmlFor="video"
              className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
            >
              <FileVideo className="e-4 h-4" />
              Select your video
            </label>
            <input
              type="file"
              id="video"
              accept="video/mp4"
              className="sr-only"
            />
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">Transcription prompt</Label>
              <Textarea
                id="transcription_prompt"
                className="h-20 leading-relaxed"
                placeholder="Please include key-words separated by comma (,)."
              />
            </div>
            <Button type="submit" className="w-full">
              Upload your video
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          </form>
          <Separator />
          <form className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a prompt..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="description">Description</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Model</Label>
              <Select disabled defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="black text-xs text-muted-foreground italic">
                Other options will be added in the future
              </span>
            </div>
            <Separator />
            <div className="space-y-4">
              <Label>Weight</Label>
              <Slider min={0} max={0} step={0.1} />
              <span className="block text-xs text-muted-foreground italic">
                Higher values should result in more creative results, but also
                increase the errors.
              </span>
            </div>
            <Separator />
            <Button type="submit" className="w-full">
              Run
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
