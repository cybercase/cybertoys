import { makeAutoObservable, reaction, when } from "mobx";
import { AppContext } from "../shared";

export class Base64VM {
  static preferences = {
    source: "base64.sourceText",
  } as const;

  sourceText = "";
  encodedText = "";
  cannotDecode = false;

  constructor(public context: AppContext) {
    makeAutoObservable(this);
    this.setSourceText(this.context.preference.load(Base64VM.preferences.source, ""));
  }

  setSourceText(value: string) {
    this.sourceText = value;
    this.encodedText = btoa(value);
  }

  setEncodedText(value: string) {
    this.encodedText = value;
    try {
      this.sourceText = atob(value);
      this.cannotDecode = false;
    } catch (err) {
      this.cannotDecode = true;
    }
  }

  serialize() {
    return { sourceText: this.sourceText };
  }

  deserialize(value: unknown) {
    const data = value as any;
    this.setSourceText(data.sourceText);
  }
}
