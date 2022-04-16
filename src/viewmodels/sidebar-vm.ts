import { makeAutoObservable, observable } from "mobx";
import { AppContext, Category, CategoryKey, ToolKey } from "../shared";
import { createInstanceMapper } from "../utils";

class SidebarCategoryVM {
  isExpanded = true;
  constructor(private category: Category) {
    makeAutoObservable<SidebarCategoryVM>(this, {
      isExpanded: observable,
    });
  }
  get key() {
    return this.category.key;
  }
  get label() {
    return this.category.label;
  }
}

export class SidebarVM {
  searchFilter = "";
  _sidebarCategoryAdapter: (category: Category) => SidebarCategoryVM;

  constructor(private context: AppContext) {
    makeAutoObservable(this);
    this._sidebarCategoryAdapter = createInstanceMapper<Category, SidebarCategoryVM>((category) => new SidebarCategoryVM(category));
  }

  get categories() {
    return new Map(
      [...this.context.modelStore.categories.entries()].map(([key, category]) => [key, this._sidebarCategoryAdapter(category)])
    );
  }

  get selected() {
    return this.context.modelStore.selectedToolKey;
  }

  get tools() {
    let tools = [...this.context.modelStore.tools];
    if (this.searchFilter) {
      tools = tools.filter(([key, tool]) => tool.title.toLowerCase().includes(this.searchFilter));
    }
    return new Map(tools);
  }

  select(key: ToolKey) {
    this.context.modelStore.selectTool(key);
  }

  setSearchFilter(value: string) {
    this.searchFilter = value.toLocaleLowerCase();
  }

  setCategoryExpanded(key: CategoryKey, value: boolean) {
    this.categories.get(key)!.isExpanded = value;
  }
}
