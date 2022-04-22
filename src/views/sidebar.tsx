import { css, cx } from "@emotion/css";
import { IconButton, TooltipHost, useTheme, Text } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { INavLink, INavLinkGroup, INavProps, Nav } from "@fluentui/react/lib/Nav";
import { ISearchBoxProps, SearchBox } from "@fluentui/react/lib/SearchBox";
import { observer } from "mobx-react-lite";
import { useCallback, useContext, useMemo } from "react";
import { CategoryKey, ToolKey } from "../shared";
import { SidebarVM } from "../viewmodels/sidebar-vm";
import { Ctx } from "./ctx";

const SidebarSearch = observer(function SidebarSearch({ vm }: { vm: SidebarVM }) {
  const theme = useTheme();
  const handleSearchChange = useCallback<NonNullable<ISearchBoxProps["onChange"]>>(
    (ev, newValue) => {
      vm.setSearchFilter(newValue ?? "");
    },
    [vm]
  );

  return (
    <SearchBox
      placeholder="Search"
      // underlined={true}
      onChange={handleSearchChange}
      value={vm.searchFilter}
      className={css({ marginBottom: theme.spacing.s1, marginTop: theme.spacing.s2 })}
    />
  );
});

const SidebarNav = observer(function SidebarNav({ vm }: { vm: SidebarVM }) {
  const navGroups = buildNavGroups(vm);

  const handleLinkClick = useCallback<NonNullable<INavProps["onLinkClick"]>>(
    (ev, item) => {
      if (!item) return;
      if (item.links) {
        vm.setCategoryExpanded(item.key!, !item.isExpanded);
      } else {
        vm.select(item.key as ToolKey);
      }
    },
    [vm]
  );

  const handleLinkExpand = useCallback<NonNullable<INavProps["onLinkExpandClick"]>>(
    (ev, item) => {
      ev?.preventDefault();
      ev?.stopPropagation();
      item && vm.setCategoryExpanded(item.key as CategoryKey, !item.isExpanded);
    },
    [vm]
  );

  return (
    <div className={css({ flex: "1 1 auto", overflow: "auto" })}>
      <Nav
        selectedKey={vm.selected}
        ariaLabel="Tools"
        groups={navGroups}
        onLinkClick={handleLinkClick}
        onLinkExpandClick={handleLinkExpand}
      />
    </div>
  );
});

const SidebarSettings = observer(function SidebarSettings() {
  const theme = useTheme();
  const { uiStore } = useContext(Ctx)!;
  const themeParams = useMemo(() => {
    return {
      iconProps: { iconName: uiStore.theme === "light" ? "clearnight" : "sunny" },
      tooltipContent: uiStore.theme === "light" ? "Dark theme" : "Light theme",
    };
  }, [uiStore.theme]);

  const handleThemeButtonClick = useCallback<NonNullable<IconButton["props"]["onClick"]>>(() => {
    uiStore.toggleTheme();
  }, [uiStore]);

  const tooltipId = useId("tooltip");
  return (
    <div className={css({ flex: "0 0 auto" })}>
      <TooltipHost id={tooltipId} content={themeParams.tooltipContent}>
        <IconButton iconProps={themeParams.iconProps} title="Theme" ariaLabel="Theme" onClick={handleThemeButtonClick} />
      </TooltipHost>
    </div>
  );
});

interface SidebarProps extends ClassNameProp {
  vm: SidebarVM;
}
// eslint-disable-next-line mobx/missing-observer
const Sidebar = function Sidebar({ vm, className }: SidebarProps) {
  const theme = useTheme();
  return (
    <div
      className={cx(
        css({
          display: "flex",
          flexDirection: "column",
          padding: theme.spacing.s2,
          backgroundColor: theme.semanticColors.bodyBackground,
        }),
        className
      )}
    >
      <SidebarSearch vm={vm} />
      <SidebarNav vm={vm} />
      <SidebarSettings />
    </div>
  );
};

function buildNavGroups(vm: SidebarVM): INavLinkGroup[] {
  const noCategoryNavLinks: INavLink[] = [];
  const categoryNavLinks = new Map<CategoryKey, INavLink>();

  for (const category of vm.categories.values()) {
    categoryNavLinks.set(category.key, {
      key: category.key,
      name: category.label,
      url: "#",
      expandAriaLabel: `Expand ${category.label}`,
      collapseAriaLabel: `Collapse ${category.label}`,
      title: "",
      links: [],
      isExpanded: category.isExpanded,
    });
  }

  for (const tool of vm.tools.values()) {
    let toolNavLinks: INavLink[];
    if (tool.category) {
      toolNavLinks = categoryNavLinks.get(tool.category)?.links ?? noCategoryNavLinks;
    } else {
      toolNavLinks = noCategoryNavLinks;
    }

    toolNavLinks.push({
      key: tool.key,
      name: tool.label,
      url: "#",
      title: "",
    });
  }

  return [{ links: noCategoryNavLinks.concat(...categoryNavLinks.values()) }];
}

export default Sidebar;
