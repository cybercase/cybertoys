import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Main from "./views/main";
import { Ctx } from "./views/ctx";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { AppContext } from "./context";
import { Categories, Tools } from "./shared";
import { UiStore } from "./stores/ui-store";
import { configure as configureMobx } from "mobx";
import { ModelStore } from "./stores/model-store";
import { PreferenceService } from "./preference";
import { SessionService } from "./session";

const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  configureMobx({
    enforceActions: "always",
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
    disableErrorBoundaries: true,
  });
}

// WARNING: The order of inizialization matters!
const context = new AppContext();
context.preference = new PreferenceService();
context.session = new SessionService();
context.modelStore = new ModelStore(context);
context.uiStore = new UiStore(context);

// Init
context.modelStore.load(Tools, Categories);

ReactDOM.render(
  <React.StrictMode>
    <Ctx.Provider value={context}>
      <Main />
    </Ctx.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
