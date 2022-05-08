import { observer } from "mobx-react-lite";
import { useCallback } from "react";
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
} from "@fluentui/react";
import { UuidVM } from "../viewmodels/uuid-vm";
import { css, cx } from "@emotion/css";
import { codeTextFieldStyle } from "./utils";
import { PropOf } from "../utils";

interface UuidProps extends ClassNameProp {
  vm: UuidVM;
}

type SpinButtonOnChangeHandler = NonNullable<PropOf<typeof SpinButton>["onChange"]>;
type PrimaryButtonOnChangeHandler = NonNullable<PropOf<typeof PrimaryButton>["onClick"]>;
type ToggleOnChangeHandler = NonNullable<PropOf<typeof Toggle>["onChange"]>;

const UuidGenerator = observer(function UuidEncoderDecoder({ vm, className }: UuidProps) {
  const theme = useTheme();

  const dummyOnChange = useCallback(() => {}, []);

  const handleCountChange = useCallback<SpinButtonOnChangeHandler>(
    (event, newValue) => {
      vm.setCount(Number.parseInt(newValue ?? "1", 10) ?? 1);
    },
    [vm]
  );

  const handleGenerate = useCallback<PrimaryButtonOnChangeHandler>(
    (event) => {
      vm.generate();
    },
    [vm]
  );

  const handleUppercase = useCallback<ToggleOnChangeHandler>(
    (event, newValue) => {
      vm.setUppercase(newValue ?? false);
    },
    [vm]
  );

  const handleClear = useCallback(() => {
    vm.clear();
  }, [vm]);

  return (
    <div className={cx(css({ padding: theme.spacing.m, display: "flex", flexDirection: "column" }), className)}>
      <div className={css({ display: "flex", flexDirection: "row", alignItems: "flex-end" })}>
        <SpinButton
          label="Count"
          labelPosition={Position.top}
          min={1}
          max={1000}
          step={1}
          onChange={handleCountChange}
          value={`${vm.count}`}
          incrementButtonAriaLabel="Increase value by 1"
          decrementButtonAriaLabel="Decrease value by 1"
          styles={{ spinButtonWrapper: { width: 75 }, root: { flex: "0", marginRight: theme.spacing.m } }}
        />
        <Toggle
          label={"Uppercase"}
          onText="On"
          offText="Off"
          onChange={handleUppercase}
          checked={vm.uppercase}
          styles={{ label: { lineHeight: 18, marginBottom: 4 }, root: { marginRight: theme.spacing.m, minWidth: 78 } }}
        />
        <PrimaryButton text="Generate" onClick={handleGenerate} allowDisabledFocus styles={{ root: { marginRight: theme.spacing.m } }} />
        <DefaultButton text="Clear" onClick={handleClear} allowDisabledFocus />
        {/* <IconButton iconProps={{ iconName: "Trash" }} aria-label="Regenerate" onClick={handleClear} /> */}
      </div>
      <TextField
        label="UUIDs"
        multiline
        resizable={false}
        onChange={dummyOnChange}
        value={vm.uuids}
        spellCheck="false"
        autoComplete="false"
        autoCorrect="false"
        className={css({ flex: "1 1 auto", marginTop: theme.spacing.m })}
        styles={codeTextFieldStyle}
      />
    </div>
  );
});

export default UuidGenerator;
