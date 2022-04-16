import { css, cx } from "@emotion/css";
import { useTheme, Text, IconButton, TooltipHost } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { observer } from "mobx-react-lite";
import { useCallback, useContext, useMemo } from "react";
import { Ctx } from "./ctx";

interface TitlebarProps extends ClassNameProp {}
export const Titlebar = observer(function Titlebar(props: TitlebarProps) {
  const theme = useTheme();
  const { uiStore } = useContext(Ctx)!;
  const themeParams = useMemo(() => {
    return {
      iconProps: { iconName: uiStore.theme === "light" ? "clearnight" : "sunny" },
      tooltipContent: uiStore.theme === "light" ? "Dark Mode" : "Light Mode",
    };
  }, [uiStore.theme]);

  const handleThemeButtonClick = useCallback<NonNullable<IconButton["props"]["onClick"]>>(() => {
    uiStore.toggleTheme();
  }, [uiStore]);

  const tooltipId = useId("tooltip");
  return (
    <div
      className={cx(
        css({
          padding: theme.spacing.m,
          display: "flex",
          alignItems: "center",
          backgroundColor: theme.palette.neutralLighter,
        }),
        props.className
      )}
    >
      <Text variant="xxLarge" className={css({ flex: "1 1 auto" })}>
        {uiStore.selectedToolTitle}
      </Text>
      <TooltipHost id={tooltipId} content={themeParams.tooltipContent}>
        <IconButton iconProps={themeParams.iconProps} title="Theme" ariaLabel="Theme" onClick={handleThemeButtonClick} />
      </TooltipHost>
    </div>
  );
});
