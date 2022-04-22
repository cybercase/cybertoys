import { PreferenceService } from "./preference";
import { ModelStore } from "./stores/model-store";
import { UiStore } from "./stores/ui-store";

export class AppContext {
  public modelStore!: ModelStore;
  public uiStore!: UiStore;
  public preference!: PreferenceService;
}
