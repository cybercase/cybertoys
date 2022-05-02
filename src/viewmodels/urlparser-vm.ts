import { makeAutoObservable } from "mobx";
import { AppContext } from "../shared";

export class UrlParserVM {
  url = "";
  _url?: URL;

  constructor(public context: AppContext) {
    makeAutoObservable(this);
  }

  setUrl(value: string) {
    this.url = value;
    try {
      this._url = new URL(value);
    } catch (err) {
      this._url = undefined;
    }
  }

  get protocol() {
    return this._url?.protocol ?? "";
  }

  get hostname() {
    return this._url?.hostname ?? "";
  }

  get port() {
    return this._url?.port ?? "";
  }

  get pathname() {
    return this._url?.pathname ?? "";
  }

  get search() {
    return this._url?.search ?? "";
  }

  get searchParams() {
    return [...(this._url?.searchParams.entries() ?? [])];
  }

  serialize() {
    return { url: this.url };
  }

  deserialize(data: unknown) {
    this.setUrl((data as any).url);
  }
}
