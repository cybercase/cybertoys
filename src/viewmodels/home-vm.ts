import { makeAutoObservable } from "mobx";
import { AppContext } from "../shared";

export class HomeVM {
  constructor(public context: AppContext) {
    makeAutoObservable(this);
  }
}
