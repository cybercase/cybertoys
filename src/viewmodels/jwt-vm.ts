import { makeAutoObservable, reaction, when } from "mobx";
import { AppContext } from "../shared";
import { fromPromise } from "mobx-utils";
import * as jose from "jose";

export class JwtVM {
  tokenText =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  secretKey = "your-256-bit-secret";
  isHeaderValid = false;
  isPayloadValid = false;

  isSignatureValid = fromPromise<boolean>(Promise.resolve(false));

  constructor(public context: AppContext) {
    makeAutoObservable(this);

    const signatureValidationDisposer = reaction(
      () => [this.secretKey, this.tokenText],
      ([secretKey, tokenText]) => {
        console.log("ehi", secretKey, tokenText);
        this.isSignatureValid = fromPromise(
          (async () => {
            const textEncoder = new TextEncoder();
            const key = textEncoder.encode(secretKey);
            try {
              await jose.jwtVerify(tokenText, key, {});
              return true;
            } catch (err) {
              return false;
            }
          })()
        );
      },
      { fireImmediately: true }
    );

    when(
      () => context.uiStore.selectedToolKey !== "jwt",
      () => {
        signatureValidationDisposer();
      }
    );
  }

  get headerText(): { valid: boolean; value?: string } {
    try {
      const value = JSON.stringify(jose.decodeProtectedHeader(this.tokenText), null, 4);
      return { valid: true, value };
    } catch (err) {
      return { valid: false };
    }
  }

  get payloadText() {
    try {
      return JSON.stringify(jose.decodeJwt(this.tokenText), null, 2);
    } catch (err) {
      return "";
    }
  }

  setTokenText(value: string) {
    this.tokenText = value;
  }

  setSecretKey(value: string) {
    this.secretKey = value;
  }

  serialize() {
    return { tokenText: this.tokenText, secretKey: this.secretKey };
  }

  deserialize(data: unknown) {
    if ((data as any).tokenText) {
      this.setTokenText((data as any).tokenText);
    }
    if ((data as any).secretKey) {
      this.setSecretKey((data as any).secretKey);
    }
  }
}
