import { makeAutoObservable, ObservableMap } from "mobx";
import { AppContext, Categories, Category, CategoryKey, Tool, ToolKey, Tools } from "../shared";

export class ModelStore {
  tools = new ObservableMap<ToolKey, Tool>();
  categories = new ObservableMap<CategoryKey, Category>();
  selectedToolKey: ToolKey = "home";

  constructor(private context: AppContext) {
    makeAutoObservable(this);
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
