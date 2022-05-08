import { makeAutoObservable } from "mobx";
import { AppContext } from "../shared";
import * as uuid from "uuid";

export class UuidVM {
  uuids = "";
  count = 1;
  uppercase = true;

  constructor(public context: AppContext) {
    makeAutoObservable(this);
  }

  setCount(val: number) {
    this.count = val;
  }

  setUppercase(val: boolean) {
    this.uppercase = val;
    this.uuids = this.uppercase ? this.uuids.toLocaleUpperCase() : this.uuids.toLocaleLowerCase();
  }

  generate() {
    const uuids: string[] = new Array<string>(this.count);
    for (let i = 0; i < this.count; i++) {
      uuids[i] = uuid.v4();
    }
    this.uuids += uuids.map((uuid) => (this.uppercase ? uuid.toLocaleUpperCase() : uuid.toLocaleLowerCase())).join("\n") + "\n";
  }

  clear() {
    this.uuids = "";
  }

  serialize() {
    return { uuids: this.uuids, count: this.count, uppercase: this.uppercase };
  }

  deserialize(data: unknown) {
    this.uuids = (data as any).uuids;
    this.count = (data as any).count;
    this.uppercase = (data as any).uppercase;
  }
}
