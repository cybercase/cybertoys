import { makeAutoObservable } from "mobx";
import { AppContext } from "../shared";

export class Base64VM {
  sourceText = "";
  encodedText = "";

  constructor(public context: AppContext) {
    makeAutoObservable(this);
  }

  setSourceText(value: string) {
    this.sourceText = value;
    this.encodedText = btoa(value);
  }

  setEncodedText(value: string) {
    this.encodedText = value;
    this.sourceText = atob(value);
  }
}
