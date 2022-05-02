import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";
import { useTheme, TextField, ITextFieldProps, Separator, Label, DetailsList, DetailsListLayoutMode, SelectionMode } from "@fluentui/react";
import { css, cx } from "@emotion/css";
import { useConst } from "@fluentui/react-hooks";
import { UrlParserVM } from "../viewmodels/urlparser-vm";
import React from "react";
import { codeTextFieldStyle } from "./utils";

interface UrlParserProps extends ClassNameProp {
  vm: UrlParserVM;
}
const UrlEncoderDecoder = observer(function UrlEncoderDecoder({ vm, className }: UrlParserProps) {
  const theme = useTheme();

  const handleUrlChange = useCallback<NonNullable<ITextFieldProps["onChange"]>>(
    (_, newValue) => {
      vm.setUrl(newValue ?? "");
    },
    [vm]
  );

  return (
    <div className={cx(css({ padding: theme.spacing.m, display: "flex", flexDirection: "column", minHeight: 0 }), className)}>
      <TextField
        label="URL"
        multiline
        resizable={false}
        onChange={handleUrlChange}
        value={vm.url}
        styles={codeTextFieldStyle}
        rows={3}
        autoCorrect="off"
        spellCheck={false}
      />
      <Separator />
      <div
        className={css({
          display: "grid",
          gridTemplateAreas: '"label value"',
          gridTemplateColumns: "auto 1fr",
          gridTemplateRows: "auto",
          gap: theme.spacing.s1,
          alignItems: "baseline",
          overflow: "hidden",
          placeItems: "start stretch",
        })}
      >
        <UrlField label={"Protocol"} value={vm.protocol} />
        <UrlField label={"Host"} value={vm.hostname} />
        <UrlField label={"Port"} value={vm.port} />
        <UrlField label={"Path"} value={vm.pathname} />
        <UrlField label={"Search"} value={vm.search} />
        <SearchParams params={vm.searchParams} />
      </div>
    </div>
  );
});

// eslint-disable-next-line mobx/missing-observer
const UrlField = React.memo((props: { label: string; value: string }) => {
  const handleDummyChange = useCallback(() => {}, []);
  const theme = useTheme();
  return (
    <>
      <div>
        <Label className={css({ textAlign: "right", marginTop: theme.spacing.s2 })}>{props.label + ": "}</Label>
      </div>
      <div>
        <TextField resizable={false} onChange={handleDummyChange} value={props.value} styles={codeTextFieldStyle} />
      </div>
    </>
  );
});

// eslint-disable-next-line mobx/missing-observer
const SearchParams = React.memo((props: { params: [string, string][] }) => {
  const columns = useConst([
    { key: "name", name: "Name", fieldName: "name", minWidth: 50, maxWidth: 200, isResizable: false },
    { key: "value", name: "Value", fieldName: "value", minWidth: 100, isResizable: false, isMultiline: true },
  ]);

  const items = useMemo(() => {
    return props.params.map(([name, value]) => ({ name, value }));
  }, [props.params]);

  return (
    <>
      <div>
        <Label className={css({ textAlign: "right" })}>Params: </Label>
      </div>
      <div className={css({ overflow: "auto", placeSelf: "normal" })}>
        <DetailsList
          compact={true}
          isHeaderVisible={false}
          items={items}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
        />
      </div>
    </>
  );
});

export default UrlEncoderDecoder;
