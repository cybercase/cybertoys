import { makeAutoObservable, reaction } from "mobx";
import { fromPromise } from "mobx-utils";
import { AppContext } from "../shared";
import SparkMD5 from "spark-md5";

function buf2hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function digestPromise(name: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512", input: string): Promise<string> {
  const textEncoder = new TextEncoder();
  const encodedTxt = textEncoder.encode(input);
  return window.crypto.subtle
    .digest(
      {
        name,
      },
      encodedTxt
    )
    .then((result) => buf2hex(result));
}

export class HashVM {
  inputText = "";
  sha1 = fromPromise<string>(Promise.resolve(""));
  sha256 = fromPromise<string>(Promise.resolve(""));
  sha384 = fromPromise<string>(Promise.resolve(""));
  sha512 = fromPromise<string>(Promise.resolve(""));

  constructor(public context: AppContext) {
    makeAutoObservable(this);

    reaction(
      () => this.inputText,
      (txt) => {
        this.sha1 = fromPromise(digestPromise("SHA-1", txt), this.sha1);
        this.sha256 = fromPromise(digestPromise("SHA-256", txt), this.sha1);
        this.sha384 = fromPromise(digestPromise("SHA-384", txt), this.sha1);
        this.sha512 = fromPromise(digestPromise("SHA-512", txt), this.sha1);
      },
      { fireImmediately: true }
    );
  }

  get md5() {
    return SparkMD5.hash(this.inputText, false);
  }

  setInputText(value: string) {
    this.inputText = value;
  }

  serialize() {
    return { inputText: this.inputText };
  }

  deserialize(data: unknown) {
    this.setInputText((data as any).inputText);
  }
}
