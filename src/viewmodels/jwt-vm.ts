import { makeAutoObservable, reaction, runInAction, when } from "mobx";
import { AppContext } from "../shared";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import * as jose from "jose";

export class JwtVM {
  tokenText =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  secretKey = "";
  isSignatureValid = fromPromise<boolean>(Promise.resolve(false));

  constructor(public context: AppContext) {
    makeAutoObservable(this);

    const signatureValidationDisposer = reaction(
      () => this.secretKey,
      () => {
        this.isSignatureValid = fromPromise(
          (async () => {
            const textEncoder = new TextEncoder();
            const key = textEncoder.encode(this.secretKey);
            try {
              await jose.jwtVerify(this.tokenText, key, {});
              return true;
            } catch (err) {
              return false;
            }
          })()
        );
      }
    );

    when(
      () => context.uiStore.selectedToolKey !== "jwt",
      () => signatureValidationDisposer()
    );
  }

  get headerText() {
    return JSON.stringify(jose.decodeProtectedHeader(this.tokenText), null, 2);
  }

  get payloadText() {
    return JSON.stringify(jose.decodeJwt(this.tokenText), null, 2);
  }

  setTokenText(value: string) {
    this.tokenText = value;
  }

  setSecretKey(value: string) {
    this.secretKey = value;
  }
}
