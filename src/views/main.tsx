import { css, cx } from "@emotion/css";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { ThemeProvider, createTheme } from "@fluentui/react";
import { observer } from "mobx-react-lite";
import React, { ReactElement, useContext, useMemo } from "react";
import { ToolKey } from "../shared";
import { UiStore } from "../stores/ui-store";
import Sidebar from "./sidebar";
import { Titlebar } from "./titlebar";
import SidebarSeparator from "./sidebar-separator";
import { darkTheme, lightTheme } from "./themes";
import { Ctx } from "./ctx";

import Base64 from "./base64";
import Home from "./home";
import Url from "./url";
import Html from "./html";
import Jwt from "./jwt";

initializeIcons();

interface ToolComponentProps {
  vm: any;
}

const componentMap: {
  [k in ToolKey]: React.ComponentType<ToolComponentProps>;
} = {
  home: Home,
  base64: Base64,
  url: Url,
  html: Html,
  jwt: Jwt,
};

const Main = observer(function Main() {
  const { uiStore } = useContext(Ctx)!;
  const appTheme = useMemo(() => {
    const themeDef = uiStore.theme === "light" ? lightTheme : darkTheme;
    return createTheme({
      defaultFontStyle: { fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu' },
      components: {
        Nav: {
          styles: { link: { height: `36px`, lineHeight: `36px` }, chevronIcon: { height: `36px` } },
        },
      },
      ...themeDef,
    });
  }, [uiStore.theme]);

  const toolKey = uiStore.selectedToolKey;
  const Component = componentMap[toolKey];
  return (
    <ThemeProvider theme={appTheme} className={css({ height: "100%" })}>
      <Layout store={uiStore} contentEl={<Component vm={uiStore.contentVM} />} />
    </ThemeProvider>
  );
});

interface LayoutProps extends ClassNameProp {
  contentEl: ReactElement;
  store: UiStore;
}

const Layout = observer(function Layout({ store, contentEl }: LayoutProps) {
  const styledContentEl = useMemo(
    () =>
      React.cloneElement(contentEl, {
        className: cx(contentEl.props.className, css({ gridArea: "content" })),
      }),
    [contentEl]
  );

  return (
    <div
      className={css({
        height: "100%",
        display: "grid",
        gridTemplateColumns: "auto auto 1fr",
        gridTemplateRows: "auto 1fr",
        gridTemplateAreas: '"sidebar sidebar-separator header"\n "sidebar sidebar-separator content" ',
        overflow: "clip",
      })}
    >
      <Titlebar className={css({ gridArea: "header" })} />
      <Sidebar className={css({ gridArea: "sidebar", width: store.sidebarWidth })} vm={store.sidebarVM} />
      <SidebarSeparator className={css({ gridArea: "sidebar-separator" })} />
      {styledContentEl}
    </div>
  );
});

export default Main;
