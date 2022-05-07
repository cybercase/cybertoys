import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { useTheme, TextField, SpinButton, Dropdown, Position, IconButton, Toggle } from "@fluentui/react";
import { css, cx } from "@emotion/css";
import { useConst } from "@fluentui/react-hooks";
import { LoremVM } from "../viewmodels/lorem-vm";
import { PropOf } from "../utils";

interface LoremProps extends ClassNameProp {
  vm: LoremVM;
}

type DropdownOnChangeHandler = NonNullable<PropOf<typeof Dropdown>["onChange"]>;
type SpinButtonOnChangeHandler = NonNullable<PropOf<typeof SpinButton>["onChange"]>;
type ToggleOnChangeHandler = NonNullable<PropOf<typeof Toggle>["onChange"]>;

const LoremEncoderDecoder = observer(function LoremEncoderDecoder({ vm, className }: LoremProps) {
  const theme = useTheme();

  const textFieldStyles = useConst(() => {
    return { wrapper: { height: "100%", display: "flex", flexDirection: "column" }, fieldGroup: { flex: "1 1 auto" } };
  });

  const dummyOnChange = useCallback(() => {}, []);

  const handleTypeChange = useCallback<DropdownOnChangeHandler>(
    (event, option, index) => {
      if (!option) {
        return;
      }
      vm.setType(`${option.key}`);
    },
    [vm]
  );

  const handleCountChange = useCallback<SpinButtonOnChangeHandler>(
    (event, newValue) => {
      vm.setCount(Number.parseInt(newValue ?? "1", 10) ?? 1);
    },
    [vm]
  );

  const handleRegenerateClick = useCallback(() => {
    vm.regenerate();
  }, [vm]);

  const handleRandomize = useCallback<ToggleOnChangeHandler>(
    (event, checked) => {
      vm.setRandomize(checked ?? false);
    },
    [vm]
  );

  const options = useConst(() => [
    { key: "paragraphs", text: "Paragraphs" },
    { key: "sentences", text: "Sentences" },
    { key: "words", text: "Words" },
  ]);

  return (
    <div className={cx(css({ padding: theme.spacing.m, display: "flex", flexDirection: "column" }), className)}>
      <div className={css({ display: "flex", flexDirection: "row", alignItems: "flex-end" })}>
        <Dropdown
          label="Type"
          selectedKey={vm.type}
          onChange={handleTypeChange}
          options={options}
          styles={{ dropdown: { width: 300 }, label: { lineHeight: 19 }, root: { marginRight: theme.spacing.m } }}
        />
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
          label={"Random"}
          onText="On"
          offText="Off"
          onChange={handleRandomize}
          checked={vm.randomize}
          styles={{ label: { lineHeight: 18, marginBottom: 4 } }}
        />
        {vm.randomize ? <IconButton iconProps={{ iconName: "Refresh" }} aria-label="Regenerate" onClick={handleRegenerateClick} /> : null}
      </div>
      <TextField
        label="Output"
        multiline
        resizable={false}
        value={vm.text}
        onChange={dummyOnChange}
        autoCorrect="off"
        spellCheck={false}
        className={css({ flex: "1 1 auto", marginTop: theme.spacing.m })}
        styles={textFieldStyles}
      />
    </div>
  );
});

export default LoremEncoderDecoder;
