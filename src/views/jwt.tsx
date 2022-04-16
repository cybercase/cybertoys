import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { useTheme, TextField, ITextFieldProps, Separator, MessageBar, MessageBarType, Label } from "@fluentui/react";
import { css, cx } from "@emotion/css";
import { useConst } from "@fluentui/react-hooks";
import { JwtVM } from "../viewmodels/jwt-vm";
import { codeTextFieldStyle } from "./utils";

interface JwtProps extends ClassNameProp {
  vm: JwtVM;
}
const HtmlEncoderDecoder = observer(function HtmlEncoderDecoder({ vm, className }: JwtProps) {
  const theme = useTheme();
  const textFieldStyles = useConst(() => codeTextFieldStyle);

  const handleTokenChange = useCallback<NonNullable<ITextFieldProps["onChange"]>>(
    (_, newValue) => {
      vm.setTokenText(newValue ?? "");
    },
    [vm]
  );

  const handleSecretOrPrivateKeyChange = useCallback<NonNullable<ITextFieldProps["onChange"]>>(
    (_, newValue) => {
      vm.setSecretKey(newValue ?? "");
    },
    [vm]
  );

  const isSignatureValid = vm.isSignatureValid?.case({ pending: () => null, fulfilled: (value) => !!value });

  return (
    <div className={cx(css({ padding: theme.spacing.m, display: "flex", flexDirection: "column" }), className)}>
      <TextField
        label="Token"
        multiline
        resizable={false}
        onChange={handleTokenChange}
        value={vm.tokenText}
        className={cx(css({ flex: "1 1 auto" }))}
        styles={textFieldStyles}
      />
      <div className={css({ marginTop: theme.spacing.s1 })}>
        <div className={css({ display: "flex" })}>
          <Label>Secret key</Label>
        </div>
        <TextField
          multiline
          resizable={false}
          onChange={handleSecretOrPrivateKeyChange}
          value={vm.secretKey}
          rows={4}
          styles={textFieldStyles}
        />
      </div>
      <Separator className={css({ marginBottom: theme.spacing.s1, marginTop: theme.spacing.s1 })} />
      <MessageBar
        delayedRender={false}
        messageBarType={isSignatureValid === null ? MessageBarType.info : isSignatureValid ? MessageBarType.success : MessageBarType.error}
      >
        {isSignatureValid === null ? "Loading" : isSignatureValid ? `Valid Signature` : `Invalid Signature`}
      </MessageBar>
      <TextField
        label="Header"
        multiline
        resizable={false}
        readOnly
        value={vm.headerText}
        className={css({ flex: "1 1 auto", marginTop: theme.spacing.s1 })}
        styles={textFieldStyles}
      />
      <TextField
        label="Payload"
        multiline
        readOnly
        resizable={false}
        value={vm.payloadText}
        className={css({ flex: "1 1 auto", marginTop: theme.spacing.s1 })}
        styles={textFieldStyles}
      />
    </div>
  );
});

export default HtmlEncoderDecoder;
