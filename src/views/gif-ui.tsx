import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
  useTheme,
  TextField,
  ITextFieldProps,
  SpinButton,
  Position,
  PrimaryButton,
  IconButton,
  DefaultButton,
  Toggle,
  Label,
  FontIcon,
  DetailsList,
  Link,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
  ProgressIndicator,
} from "@fluentui/react";
import { GifVM } from "../viewmodels/gif-vm";
import { css, cx } from "@emotion/css";
import { codeTextFieldStyle } from "./utils";
import { humanFileSize, PropOf } from "../utils";
import { useConst } from "@fluentui/react-hooks";
import { toJS } from "mobx";

interface GifProps extends ClassNameProp {
  vm: GifVM;
}

type SpinButtonOnChangeHandler = NonNullable<PropOf<typeof SpinButton>["onChange"]>;
type PrimaryButtonOnChangeHandler = NonNullable<PropOf<typeof PrimaryButton>["onClick"]>;
type ToggleOnChangeHandler = NonNullable<PropOf<typeof Toggle>["onChange"]>;

const GifGenerator = observer(function GifEncoderDecoder({ vm, className }: GifProps) {
  const theme = useTheme();

  const handleClear = useCallback(() => {
    vm.clear();
  }, [vm]);

  const handleFpsChange = useCallback<SpinButtonOnChangeHandler>(
    (event, newValue) => {
      vm.setFPS(Number.parseInt(newValue ?? "10", 10) || 10);
    },
    [vm]
  );

  const handleWidthChange = useCallback<SpinButtonOnChangeHandler>(
    (event, newValue) => {
      vm.setWidth(Number.parseInt(newValue ?? "10", 10) || 10);
    },
    [vm]
  );

  return (
    <div className={cx(css({ padding: theme.spacing.m, display: "flex", flexDirection: "column" }), className)}>
      <div className={css({ display: "flex", flexDirection: "row", alignItems: "flex-end" })}>
        <SpinButton
          label="FPS"
          labelPosition={Position.top}
          min={1}
          max={60}
          step={1}
          value={vm.fps.toString()}
          onChange={handleFpsChange}
          incrementButtonAriaLabel="Increase FPS by 1"
          decrementButtonAriaLabel="Decrease FPS by 1"
          styles={{ spinButtonWrapper: { width: 75 }, root: { flex: "0", marginRight: theme.spacing.m } }}
        />
        <SpinButton
          label="Width"
          labelPosition={Position.top}
          min={32}
          max={1024}
          step={1}
          value={vm.width.toString()}
          onChange={handleWidthChange}
          incrementButtonAriaLabel="Increase width by 1"
          decrementButtonAriaLabel="Decrease width by 1"
          styles={{ spinButtonWrapper: { width: 75 }, root: { flex: "0", marginRight: theme.spacing.m } }}
        />
        <div className={css({ flex: "1 1 auto" })}></div>
        <DefaultButton text="Clear" onClick={handleClear} />
      </div>
      <Droparea vm={vm} />
      {/* {hasFiles ? <ConvertView vm={vm} /> : <Droparea vm={vm} />} */}
    </div>
  );
});

const ConvertView = observer(function ConvertView({ vm }: { vm: GifVM }) {
  const columns = useConst([
    { key: "name", name: "Name", fieldName: "name", minWidth: 100, isResizable: false },
    // { key: "size", name: "Size", fieldName: "value", minWidth: 100, maxWidth: 200, isResizable: false },
    { key: "status", name: "", fieldName: "status", minWidth: 200, maxWidth: 200, isResizable: false },
  ]);

  const outputFileMap = toJS(vm.outputFileMap);

  const handleRenderItemColumn = useCallback(
    function (item?: any, index?: number, column?: IColumn): React.ReactNode {
      const fieldContent = item[column!.fieldName!] as string;
      switch (column!.key) {
        case "status": {
          const res = outputFileMap.get(item.key)!;
          if (res.status === "queued") {
            return <ProgressIndicator description="Queued" />;
          } else if (res.status === "started") {
            return <ProgressIndicator description="Started" />;
          } else if (res.status === "done") {
            return (
              <Link href={res.resultUrl!} download={"result.gif"}>
                Download
              </Link>
            );
          }
          break;
        }
        default:
          return <span>{fieldContent}</span>;
      }
    },
    [outputFileMap]
  );

  const items: any[] = [];
  for (const [key, file] of vm.inputFileMap.entries()) {
    items.push({
      key: key,
      name: `${file.name} (${humanFileSize(file.size)})`,
      // value: humanFileSize(file.size),
      // status: '...',
    });
  }

  return (
    <div className={css({ flex: "1 1 auto" })}>
      <DetailsList
        items={items}
        columns={columns}
        setKey="set"
        onRenderItemColumn={handleRenderItemColumn}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        ariaLabelForSelectionColumn="Toggle selection"
        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
        checkButtonAriaLabel="select row"
      />
    </div>
  );
});

const Droparea = observer(function Droparea({ vm }: { vm: GifVM }) {
  const theme = useTheme();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      vm.addInputFiles(acceptedFiles);
    },
    [vm]
  );

  const hasFiles = vm.inputFileMap.size !== 0;
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "video/*": [] }, noClick: hasFiles });

  return (
    <div {...getRootProps()} className={css({ flex: "1 1 auto", display: "flex", flexDirection: "column", marginTop: theme.spacing.m })}>
      <input {...getInputProps()} />
      {/* <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}> */}
      {!hasFiles ? (
        <div
          className={css({
            padding: 10,
            border: "2px dashed " + theme.palette.neutralTertiary,
            flex: "1 1  auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <FontIcon
            aria-label="Drop"
            iconName="Installation"
            className={css({
              fontSize: 50,
              height: 50,
              width: 50,
              margin: theme.spacing.l2,
            })}
          />
          <Link href="">Click, or Drag your Video files here to start.</Link>
        </div>
      ) : (
        <ConvertView vm={vm} />
      )}
      {/* </div> */}
    </div>
  );
});

export default GifGenerator;
