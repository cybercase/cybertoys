import { makeAutoObservable } from "mobx";
import { AppContext } from "../shared";

export class UrlVM {
  sourceText = "";
  encodedText = "";

  constructor(public context: AppContext) {
    makeAutoObservable(this);
  }

  setSourceText(value: string) {
    this.sourceText = value;
    this.encodedText = encodeURIComponent(value);
  }

  setEncodedText(value: string) {
    this.encodedText = value;
    this.sourceText = decodeURIComponent(value);
  }

  serialize() {
    return { sourceText: this.sourceText };
  }

  deserialize(data: unknown) {
    this.setSourceText((data as any).sourceText);
  }
}
