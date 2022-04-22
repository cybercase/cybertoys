import { css, cx } from "@emotion/css";
import { VerticalDivider } from "@fluentui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useContext, useRef } from "react";
import { UiStore } from "../stores/ui-store";
import { Ctx } from "./ctx";

const SidebarSeparator = observer(function SidebarSeparator(props: ClassNameProp) {
  const ctx = useContext(Ctx)!;
  const handleMouseDown = useSidebarResize(ctx?.uiStore);
  return (
    <div
      className={cx(
        css({
          paddingLeft: `2px`,
          marginLeft: `-3px`,
          cursor: "col-resize",
          display: "flex",
          justifyContent: "center",
          "& :first-child": { visibility: "hidden" },
          // "&:hover": {
          //   "& :first-child": { visibility: "visible" },
          // },
        }),
        props.className
      )}
      onMouseDown={handleMouseDown}
    >
      <VerticalDivider></VerticalDivider>
    </div>
  );
});

const useSidebarResize = function (store: UiStore) {
  const initialSidebarWidthRef = useRef<{ width: number; event: MouseEvent }>({ width: store.sidebarWidth, event: new MouseEvent("") });
  const onMouseDown = useCallback(
    (ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      initialSidebarWidthRef.current = {
        width: store.sidebarWidth,
        event: ev,
      };
      window.document.body.style.cursor = "col-resize";
    },
    [store]
  );

  const onMouseMove = useCallback(
    (ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      store.setSidebarWidth(initialSidebarWidthRef.current.width + ev.x - initialSidebarWidthRef.current.event.x);
    },
    [store]
  );

  const handleMouseDown = useCallback<React.MouseEventHandler>(
    (event) => {
      onMouseDown(event.nativeEvent);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener(
        "mouseup",
        () => {
          window.removeEventListener("mousemove", onMouseMove);
          window.document.body.style.cursor = "";
        },
        { once: true }
      );
    },
    [onMouseDown, onMouseMove]
  );
  return handleMouseDown;
};

export default SidebarSeparator;
