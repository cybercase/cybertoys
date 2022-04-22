import { makeAutoObservable, reaction } from "mobx";
import type { AppContext, ToolKey } from "../shared";
import { Base64VM } from "../viewmodels/base64-vm";
import { HomeVM } from "../viewmodels/home-vm";
import { HtmlVM } from "../viewmodels/html-vm";
import { JwtVM } from "../viewmodels/jwt-vm";
import { SidebarVM } from "../viewmodels/sidebar-vm";
import { UrlVM } from "../viewmodels/url-vm";

type ToolVMClass = (HomeVM | Base64VM | UrlVM | HtmlVM) & { serialize?: () => unknown; deserialize?: (value: unknown) => void };

const vms: { [k in ToolKey]: new (context: AppContext) => ToolVMClass } = {
  home: HomeVM,
  base64: Base64VM,
  url: UrlVM,
  html: HtmlVM,
  jwt: JwtVM,
};

export class UiStore {
  sidebarVM: SidebarVM;
  contentVM?: ToolVMClass;
  sidebarWidth: number;
  theme: "light" | "dark";

  constructor(private context: AppContext) {
    this.sidebarVM = new SidebarVM(this.context);
    this.sidebarWidth = this.context.preference.load("sidebar-width", 200);
    this.theme = this.context.preference.load("theme", "dark");

    makeAutoObservable(this);

    reaction(
      () => this.selectedToolKey,
      (toolKey, prevToolKey) => {
        // Save old state
        const toolState = this.contentVM?.serialize?.() ?? null;
        if (toolState) {
          this.context.preference.save(prevToolKey, toolState);
        }

        // Instantiate new ToolVM
        this.contentVM = new vms[toolKey](this.context);

        // Load saved state
        const storedState = this.context.preference.load(toolKey, null);
        if (storedState !== null) {
          this.contentVM.deserialize?.(storedState);
        }
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
    this.context.preference.saveDebounced("sidebar-width", this.sidebarWidth);
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    this.context.preference.save("theme", this.theme);
  }
}
