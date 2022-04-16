import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { useTheme, TextField, ITextFieldProps } from "@fluentui/react";
import { css, cx } from "@emotion/css";
import { useConst } from "@fluentui/react-hooks";
import { HtmlVM } from "../viewmodels/html-vm";

interface HtmlProps extends ClassNameProp {
  vm: HtmlVM;
}
const HtmlEncoderDecoder = observer(function HtmlEncoderDecoder({ vm, className }: HtmlProps) {
  const theme = useTheme();
  const textFieldStyles = useConst(() => {
    return { wrapper: { height: "100%", display: "flex", flexDirection: "column" }, fieldGroup: { flex: "1 1 auto" } };
  });

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
        label="Source"
        multiline
        resizable={false}
        onChange={handleSourceChange}
        value={vm.sourceText}
        className={css({ flex: "1 1 50%" })}
        styles={textFieldStyles}
      />
      <TextField
        label="Encoded"
        multiline
        resizable={false}
        onChange={handleEncodedChange}
        value={vm.encodedText}
        className={css({ flex: "1 1 50%", marginTop: theme.spacing.m })}
        styles={textFieldStyles}
      />
    </div>
  );
});

export default HtmlEncoderDecoder;