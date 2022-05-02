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
const JwtEncoderDecoder = observer(function JwtEncoderDecoder({ vm, className }: JwtProps) {
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
  const isHeaderValid = vm.headerText.valid;
  const isPayloadValid = true;

  let message: string;
  let messageType: MessageBarType;
  if (!isHeaderValid) {
    message = "Invalid header";
    messageType = MessageBarType.error;
  } else if (!isPayloadValid) {
    message = "Invalid payload";
    messageType = MessageBarType.error;
  } else {
    if (isSignatureValid === null) {
      message = "Loading";
      messageType = MessageBarType.info;
    } else if (isSignatureValid) {
      message = `Valid Signature`;
      messageType = MessageBarType.success;
    } else {
      message = `Invalid Signature`;
      messageType = MessageBarType.error;
    }
  }

  return (
    <div className={cx(css({ padding: theme.spacing.m, display: "flex", flexDirection: "column" }), className)}>
      <TextField label="Token" multiline resizable={false} onChange={handleTokenChange} value={vm.tokenText} styles={textFieldStyles} />
      <div className={css({ marginTop: theme.spacing.s1 })}>
        <div className={css({ display: "flex" })}>
          <Label>Secret key</Label>
        </div>
        <TextField
          multiline
          resizable={false}
          onChange={handleSecretOrPrivateKeyChange}
          value={vm.secretKey}
          rows={3}
          styles={textFieldStyles}
        />
      </div>
      <Separator />
      <MessageBar delayedRender={false} messageBarType={messageType}>
        {message}
      </MessageBar>
      <div className={css({ display: "flex", flex: "1 1 auto" })}>
        <TextField
          label="Payload"
          multiline
          readOnly
          resizable={false}
          value={vm.payloadText}
          className={css({ flex: "1 1 auto", marginTop: theme.spacing.s1, marginRight: theme.spacing.s1 })}
          styles={textFieldStyles}
        />
        <TextField
          label="Header"
          multiline
          resizable={false}
          readOnly
          value={vm.headerText.value ?? ""}
          className={css({ flex: "1 1 auto", marginTop: theme.spacing.s1, marginLeft: theme.spacing.s1 })}
          styles={textFieldStyles}
        />
      </div>
    </div>
  );
});

export default JwtEncoderDecoder;
