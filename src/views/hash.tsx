import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { useTheme, TextField, ITextFieldProps } from "@fluentui/react";
import { HashVM } from "../viewmodels/hash-vm";
import { css, cx } from "@emotion/css";
import { useConst } from "@fluentui/react-hooks";

interface HashProps extends ClassNameProp {
  vm: HashVM;
}
const HashGenerator = observer(function HashGenerator({ vm, className }: HashProps) {
  const theme = useTheme();
  const textFieldStyles = useConst(() => {
    return { wrapper: { height: "100%", display: "flex", flexDirection: "column" }, fieldGroup: { flex: "1 1 auto" } };
  });

  const handleInputChange = useCallback<NonNullable<ITextFieldProps["onChange"]>>(
    (_, newValue) => {
      vm.setInputText(newValue ?? "");
    },
    [vm]
  );
  const dummyOnChange = useCallback(() => {}, []);

  const md5 = vm.md5;
  const sha1 = (vm.sha1.value as string) ?? "";
  const sha256 = (vm.sha256.value as string) ?? "";
  const sha384 = (vm.sha384.value as string) ?? "";
  const sha512 = (vm.sha512.value as string) ?? "";
  return (
    <div className={cx(css({ padding: theme.spacing.m, display: "flex", flexDirection: "column" }), className)}>
      <TextField label="Input" multiline resizable={false} onChange={handleInputChange} value={vm.inputText} rows={7} />
      <TextField
        label="MD5"
        resizable={false}
        value={md5}
        onChange={dummyOnChange}
        readOnly
        className={css({ flex: "0 0 auto", marginTop: theme.spacing.m })}
      />
      <TextField
        label="SHA-1"
        resizable={false}
        value={sha1}
        onChange={dummyOnChange}
        readOnly
        className={css({ flex: "0 0 auto", marginTop: theme.spacing.m })}
      />
      <TextField
        label="SHA-256"
        resizable={false}
        value={sha256}
        onChange={dummyOnChange}
        readOnly
        className={css({ flex: "0 0 auto", marginTop: theme.spacing.m })}
      />
      <TextField
        label="SHA-384"
        resizable={false}
        value={sha384}
        onChange={dummyOnChange}
        readOnly
        className={css({ flex: "0 0 auto", marginTop: theme.spacing.m })}
      />
      <TextField
        label="SHA-512"
        resizable={false}
        value={sha512}
        onChange={dummyOnChange}
        readOnly
        className={css({ flex: "0 0 auto", marginTop: theme.spacing.m })}
      />
    </div>
  );
});

export default HashGenerator;
