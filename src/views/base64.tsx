import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { useTheme, TextField, ITextFieldProps } from "@fluentui/react";
import { Base64VM } from "../viewmodels/base64-vm";
import { css, cx } from "@emotion/css";
import { codeTextFieldStyle } from "./utils";

interface Base64Props extends ClassNameProp {
  vm: Base64VM;
}
const Base64EncoderDecoder = observer(function Base64EncoderDecoder({ vm, className }: Base64Props) {
  const theme = useTheme();

  const handleSourceChange = useCallback<NonNullable<ITextFieldProps["onChange"]>>(
    (_, newValue) => {
      vm.setSourceText(newValue ?? "");
    },
    [vm]
  );

  const handleEncodedChange = useCallback<NonNullable<ITextFieldProps["onChange"]>>(
    (_, newValue) => {
      vm.setEncodedText(newValue ?? "");
    },
    [vm]
  );

  return (
    <div className={cx(css({ padding: theme.spacing.m, display: "flex", flexDirection: "column" }), className)}>
      <TextField
        label="Decoded"
        multiline
        resizable={false}
        onChange={handleSourceChange}
        value={vm.cannotDecode ? `Base64 payload is binary. Cannot display.` : vm.sourceText}
        className={css({ flex: "1 1 50%" })}
        styles={codeTextFieldStyle}
      />
      <TextField
        label="Encoded"
        multiline
        resizable={false}
        onChange={handleEncodedChange}
        value={vm.encodedText}
        className={css({ flex: "1 1 50%", marginTop: theme.spacing.m })}
        styles={codeTextFieldStyle}
      />
    </div>
  );
});

export default Base64EncoderDecoder;
