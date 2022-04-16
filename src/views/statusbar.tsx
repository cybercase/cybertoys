import { css, cx } from "@emotion/css";
import { observer } from "mobx-react-lite";

interface StatusbarProps extends ClassNameProp {}

export const Statusbar = observer(function Statusbar(props: StatusbarProps) {
  return <div className={cx(css({ display: "flex", justifyContent: "center" }), props.className)}>statusbar</div>;
});
