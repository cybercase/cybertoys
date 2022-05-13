import { makeAutoObservable, observable, runInAction, toJS } from "mobx";
import { AppContext } from "../shared";
import { createWorker } from "@ffmpeg/ffmpeg";
import { getPublicPathFor } from "../utils";

export class GifVM {
  readonly inputFileMap = observable.map<string, File>({});
  readonly outputFileMap = observable.map<string, { status: string; resultUrl?: string }>({});
  fps: number = 10;
  width: number = 640;
  worker: any;

  constructor(public context: AppContext) {
    makeAutoObservable(this, { worker: false });
  }

  async addInputFiles(files: File[]) {
    const uploadDate = new Date().toISOString();

    const mappedInputFiles = new Map<string, File>(files.map((file) => [`${uploadDate}-${file.name}`, file]));
    const mappedOutputFiles = new Map<string, { status: string; resultUrl?: string }>(
      files.map((file) => [`${uploadDate}-${file.name}`, { status: "queued" }])
    );

    this.inputFileMap.merge(mappedInputFiles);
    this.outputFileMap.merge(mappedOutputFiles);

    if (this.worker) {
      this.worker.terminate();
    }

    this.worker = createWorker({
      logger: (payload: any) => {
        console.log(payload.action, payload.message);
      },
      corePath: `${getPublicPathFor("ffmpeg-core.js")}`,
      workerPath: `${getPublicPathFor("ffmpeg-worker.min.js")}`,
    });

    await this.worker.load();

    for (const [key, file] of mappedInputFiles.entries()) {
      runInAction(() => {
        this.outputFileMap.set(key, { status: "started" });
      });

      const fileExt = file.name.split(".").pop();
      const inputFileName = `input.${fileExt}`;
      const outputFileName = `output.gif`;
      await this.worker.write(inputFileName, file);
      await this.worker.transcode(
        inputFileName,
        outputFileName,
        `-filter_complex fps=${this.fps},scale=${this.width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer`
      );
      let { data } = await this.worker.read(outputFileName);
      const blob = new Blob([data.buffer], { type: "image/gif" });
      const blobUrl = URL.createObjectURL(blob);

      runInAction(() => {
        this.outputFileMap.set(key, { status: "done", resultUrl: blobUrl });
      });

      await this.worker.remove(inputFileName);
      await this.worker.remove(outputFileName);
    }

    this.worker.terminate();
    this.worker = null;
  }

  clear() {
    this.inputFileMap.replace(new Map());

    for (const tmp of this.outputFileMap.values()) {
      if (tmp.resultUrl) {
        URL.revokeObjectURL(tmp.resultUrl);
      }
    }
    this.outputFileMap.replace(new Map());
  }

  setFPS(value: number) {
    this.fps = value;
  }

  setWidth(value: number) {
    this.width = value;
  }

  serialize() {
    return {
      inputFileMap: toJS(this.inputFileMap),
      outputFileMap: toJS(this.outputFileMap),
      fps: this.fps,
    };
  }

  deserialize(data: unknown) {
    this.inputFileMap.replace((data as any).inputFileMap ?? new Map());
    this.outputFileMap.replace((data as any).outputFileMap ?? new Map());
    this.setFPS((data as any).fps ?? 10);
  }
}
