import { makeAutoObservable, reaction } from "mobx";
import type { AppContext, ToolKey } from "../shared";
import { Base64VM } from "../viewmodels/base64-vm";
import { HomeVM } from "../viewmodels/home-vm";
import { HtmlVM } from "../viewmodels/html-vm";
import { JwtVM } from "../viewmodels/jwt-vm";
import { SidebarVM } from "../viewmodels/sidebar-vm";
import { UrlVM } from "../viewmodels/url-vm";

type ToolVMClass = HomeVM | Base64VM | UrlVM | HtmlVM;

const vms: { [k in ToolKey]: new (context: AppContext) => ToolVMClass } = {
  home: HomeVM,
  base64: Base64VM,
  url: UrlVM,
  html: HtmlVM,
  jwt: JwtVM,
};

export class UiStore {
  sidebarVM: SidebarVM;
  contentVM!: ToolVMClass;
  sidebarWidth: number;
  theme: "light" | "dark";

  constructor(private context: AppContext) {
    this.sidebarVM = new SidebarVM(this.context);
    this.sidebarWidth = 250;
    this.theme = "light";

    makeAutoObservable(this);

    reaction(
      () => this.selectedToolKey,
      (toolKey) => {
        this.contentVM = new vms[toolKey](this.context);
      },
      { name: `UiStore-Selection` }
    );
  }

  get selectedToolKey() {
    return this.context.modelStore.selectedToolKey;
  }

  get selectedToolTitle() {
    return this.context.modelStore.tools.get(this.selectedToolKey)?.title ?? `Unknown`;
  }

  setSidebarWidth(value: number) {
    this.sidebarWidth = Math.min(Math.max(value, 200), 400);
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
  }
}
