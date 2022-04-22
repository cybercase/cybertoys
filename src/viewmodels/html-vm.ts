import { makeAutoObservable } from "mobx";
import { AppContext } from "../shared";
import { encode, decode } from "html-entities";

export class HtmlVM {
  sourceText = "";
  encodedText = "";

  constructor(public context: AppContext) {
    makeAutoObservable(this);
  }

  setSourceText(value: string) {
    this.sourceText = value;
    this.encodedText = encode(value);
  }

  setEncodedText(value: string) {
    this.encodedText = value;
    this.sourceText = decode(value);
  }

  serialize() {
    return { sourceText: this.sourceText };
  }

  deserialize(data: unknown) {
    this.setSourceText((data as any).sourceText);
  }
}
