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
    this.encodedText = encodeURI(value);
  }

  setEncodedText(value: string) {
    this.encodedText = value;
    this.sourceText = decodeURI(value);
  }
}
