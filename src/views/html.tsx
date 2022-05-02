import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { useTheme, TextField, ITextFieldProps } from "@fluentui/react";
import { css, cx } from "@emotion/css";
import { HtmlVM } from "../viewmodels/html-vm";
import { codeTextFieldStyle } from "./utils";

interface HtmlProps extends ClassNameProp {
  vm: HtmlVM;
}
const HtmlEncoderDecoder = observer(function HtmlEncoderDecoder({ vm, className }: HtmlProps) {
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
        value={vm.sourceText}
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

export default HtmlEncoderDecoder;
