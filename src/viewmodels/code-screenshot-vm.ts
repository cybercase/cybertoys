import { makeAutoObservable } from "mobx";
import { AppContext } from "../shared";

export class CodeScreenshotVM {
  source = "// Here goes your art";
  fontSize: number = 16;
  width: number = 800;
  lineNumbers: boolean = false;
  theme: string = "monokai";
  language: string = "typescript";

  constructor(public context: AppContext) {
    makeAutoObservable(this);
  }

  setSource(value: string) {
    this.source = value;
  }

  setFontSize(value: number) {
    this.fontSize = value;
  }

  setWidth(value: number) {
    this.width = value;
  }

  setLineNumbers(value: boolean) {
    this.lineNumbers = value;
  }

  setTheme(value: string) {
    this.theme = value;
  }

  setLanguage(value: string) {
    this.language = value;
  }

  serialize() {
    return {
      source: this.source,
      width: this.width,
      lineNumbers: this.lineNumbers,
      fontSize: this.fontSize,
      theme: this.theme,
      language: this.language,
    };
  }

  deserialize(data: unknown) {
    this.setSource((data as any).source);
    this.setWidth((data as any).width);
    this.setFontSize((data as any).fontSize);
    this.setLineNumbers((data as any).lineNumbers);
    this.setTheme((data as any).theme);
    this.setLanguage((data as any).language);
  }
}
