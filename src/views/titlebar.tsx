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
  return (
    <div
      className={cx(
        css({
          backgroundColor: theme.semanticColors.bodyStandoutBackground,
          borderTopLeftRadius: 8,
          padding: theme.spacing.m,
        }),
        props.className
      )}
    >
      <Text variant="large" className={css({ flex: "1 1 auto" })}>
        {uiStore.selectedToolTitle}
      </Text>
    </div>
  );
});
