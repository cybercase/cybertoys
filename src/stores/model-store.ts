import { makeAutoObservable, ObservableMap, reaction } from "mobx";
import { AppContext, Categories, Category, CategoryKey, Tool, ToolKey, Tools } from "../shared";

export class ModelStore {
  tools = new ObservableMap<ToolKey, Tool>();
  categories = new ObservableMap<CategoryKey, Category>();
  selectedToolKey: ToolKey;

  constructor(private context: AppContext) {
    this.selectedToolKey = this.context.preference.load("model.lastUsedToolKey", "home");
    makeAutoObservable(this);
    reaction(
      () => this.selectedToolKey,
      (toolKey) => {
        this.context.preference.save("model.lastUsedToolKey", toolKey);
      }
    );
  }

  load(tools: readonly Tool[], categories: readonly Category[]) {
    for (const tool of tools) {
      this.tools.set(tool.key, { ...tool });
    }
    for (const category of categories) {
      this.categories.set(category.key, { ...category });
    }
  }

  selectTool(key: ToolKey) {
    this.selectedToolKey = key;
  }
}
