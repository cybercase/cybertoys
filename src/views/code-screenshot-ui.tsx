import { observer } from "mobx-react-lite";
import { MouseEventHandler, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useTheme, PrimaryButton, Dropdown, Slider, Toggle } from "@fluentui/react";
import { css, cx } from "@emotion/css";
import { CodeScreenshotVM } from "../viewmodels/code-screenshot-vm";
import { Ctx } from "./ctx";
import { PropOf } from "../utils";
import CodeMirror from "codemirror";
import { useConst } from "@fluentui/react-hooks";

import "codemirror/lib/codemirror.css";
import "hack-font/build/web/hack.css";

type SliderChangeHandler = NonNullable<PropOf<typeof Slider>["onChange"]>;
type ToggleOnChangeHandler = NonNullable<PropOf<typeof Toggle>["onChange"]>;
type DropdownOnChangeHandler = NonNullable<PropOf<typeof Dropdown>["onChange"]>;

interface CodeScreenshotProps extends ClassNameProp {
  vm: CodeScreenshotVM;
}

// TODO: this needs some refactoring
const CodeScreenshot = observer(function CodeScreenshot({ vm, className }: CodeScreenshotProps) {
  const appCtx = useContext(Ctx)!;
  const theme = useTheme();
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<CodeMirror.EditorFromTextArea>(null); //useRef<CodeMirror.EditorFromTextArea>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const editorConfig = useMemo<CodeMirror.EditorConfiguration>(() => {
    return {
      smartIndent: true,
      screenReaderLabel: "Code editor",
      lineWrapping: true,
      viewportMargin: Infinity,

      lineNumbers: vm.lineNumbers ?? false,
      theme: vm.theme ?? null,
      mode: LANGUAGES[vm.language as keyof typeof LANGUAGES].mode,
    };
  }, [vm.lineNumbers, vm.theme, vm.language]);

  // Keep codemirror config in sync
  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    const editor = editorRef.current;

    for (const key of Object.keys(editorConfig)) {
      const typedKey = key as keyof CodeMirror.EditorConfiguration;
      const currentValue = editor.getOption(typedKey);
      const newValue = editorConfig[typedKey];

      if (currentValue !== newValue) {
        editor.setOption(typedKey, editorConfig[typedKey]);
      }
    }
  }, [editorConfig]);

  // Initialize codemirror editor
  useEffect(() => {
    const editor = CodeMirror.fromTextArea(textareaRef.current!, editorConfig);
    const changeListener = (cm: CodeMirror.Editor, _data: unknown) => {
      vm.setSource(cm.getValue() ?? "");
    };
    editor.on("change", changeListener);

    //@ts-ignore
    editorRef.current = editor;

    return () => {
      editor.toTextArea();
      editor.off("change", changeListener);
    };
  }, [editorConfig, vm]);

  // Load modes
  useEffect(() => {
    if (vm.language in LANGUAGES) {
      const lang = LANGUAGES[vm.language as keyof typeof LANGUAGES];
      import("codemirror/mode/" + lang.path + ".js").then(() => {
        editorRef.current?.refresh();
        editorRef.current?.setOption("mode", lang.mode);
      });
    }
  }, [vm.language]);

  // Load themes
  useEffect(() => {
    if (vm.theme in THEMES) {
      import("codemirror/theme/" + THEMES[vm.theme as keyof typeof THEMES] + ".css").then(() => {
        editorRef.current?.refresh();
        editorRef.current?.setOption("theme", vm.theme);
      });
    }
  }, [vm.theme]);

  const handleSave = useCallback(() => {
    appCtx.htmlRenderer.renderElement(bgRef.current!);
  }, [appCtx.htmlRenderer]);

  const handleFontSizeChange = useCallback<SliderChangeHandler>(
    (value) => {
      vm.setFontSize(value);
      editorRef.current?.refresh();
    },
    [vm]
  );

  const themeOptions = useConst(() =>
    Object.entries(THEMES).map(([key, name]) => ({
      key: key,
      text: name,
    }))
  );

  const languageOptions = useConst(() =>
    Object.entries(LANGUAGES).map(([key, language]) => ({
      key: key,
      text: language.name,
    }))
  );

  const handleResizeMouseDown = useCallback<MouseEventHandler<HTMLDivElement>>(
    (event) => {
      const startWidth = vm.width ?? containerRef.current!.getBoundingClientRect().width;
      const startX = event.clientX;

      const mouseMoveHandler = (moveEvent: Event) => {
        const clientX = Math.max(0, Math.min((moveEvent as MouseEvent).clientX, window.innerWidth - 64));
        vm.setWidth(Math.min(Math.max(256, startWidth + (clientX - startX) * 2), 1024));
      };
      window.addEventListener("mousemove", mouseMoveHandler);

      const mouseUpHandler = () => {
        window.removeEventListener("mousemove", mouseMoveHandler);
        editorRef.current?.refresh();
      };
      window.addEventListener("mouseup", mouseUpHandler, { once: true });
    },
    [vm]
  );

  const handleToggleLineNumbers = useCallback<ToggleOnChangeHandler>(
    (event, checked) => {
      vm.setLineNumbers(checked ?? false);
    },
    [vm]
  );

  const handleThemeChange = useCallback<DropdownOnChangeHandler>(
    (event, option) => {
      vm.setTheme(option?.key ? `${option.key}` : "default");
    },
    [vm]
  );

  const handleLanguageChange = useCallback<DropdownOnChangeHandler>(
    (event, option) => {
      vm.setLanguage(option?.key ? `${option.key}` : "auto");
    },
    [vm]
  );

  return (
    <div className={cx(css({ padding: theme.spacing.m, display: "flex", flexDirection: "column" }), className)}>
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          marginBottom: theme.spacing.m,
          gap: theme.spacing.m,
        })}
      >
        <Dropdown
          label="Theme"
          selectedKey={vm.theme}
          onChange={handleThemeChange}
          options={themeOptions}
          styles={{ dropdown: { width: 150 }, label: { lineHeight: 19 } }}
        />

        <Dropdown
          label="Language"
          selectedKey={vm.language}
          onChange={handleLanguageChange}
          options={languageOptions}
          styles={{ dropdown: { width: 150 }, label: { lineHeight: 19 } }}
        />
        <Toggle
          label={"Line Numbers"}
          onText="On"
          offText="Off"
          onChange={handleToggleLineNumbers}
          checked={vm.lineNumbers}
          styles={{ label: { lineHeight: 18, marginBottom: 4 } }}
        />
        <Slider
          label="Font size"
          max={64}
          min={6}
          showValue
          value={vm.fontSize}
          ariaValueText={(value: number) => `${value} pixels`}
          valueFormat={(value: number) => `${value}px`}
          onChange={handleFontSizeChange}
          styles={{ root: { width: 164 } }}
        />
        <div className={css({ flex: "1 1 auto" })}></div>
        <PrimaryButton text="Save" onClick={handleSave} />
      </div>
      <div
        className={css({
          flex: "1 1 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: theme.spacing.m,
          overflow: "overlay",
        })}
      >
        <div
          ref={bgRef}
          className={css({
            flex: "0 0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing.l2,
            backgroundColor: `#4A90E2`,
          })}
        >
          <div
            ref={containerRef}
            className={css({
              fontSize: vm.fontSize,
              lineHeight: 1.3333,
              fontFamily: "Hack, monospace",
              position: "relative",
              width: vm.width,
              alignSelf: "center",
              overflow: "hidden",
              borderRadius: 5,
            })}
          >
            <textarea ref={textareaRef} defaultValue={vm.source} />
            <div
              className={css({
                position: "absolute",
                right: 0,
                bottom: 0,
                height: "100%",
                width: theme.spacing.m,
                backgroundColor: theme.semanticColors.bodyDivider,
                opacity: 0,
                ":hover": { opacity: 1, cursor: "col-resize" },
              })}
              onMouseDown={handleResizeMouseDown}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CodeScreenshot;

const THEMES = {
  monokai: "monokai",
  ambiance: "ambiance",
  "ayu-dark": "ayu-dark",
  "ayu-mirage": "ayu-mirage",
  blackboard: "blackboard",
  cobalt: "cobalt",
  bespin: "bespin",
  dracula: "dracula",
  "duotone-dark": "duotone-dark",
  "duotone-light": "duotone-light",
  idea: "idea",
  neo: "neo",
  material: "material",
  "mdn-like": "mdn-like",
};

const LANGUAGES = {
  typescript: {
    mode: "text/typescript",
    name: "Typescript",
    path: `javascript/javascript`,
  },
  javascript: {
    mode: "text/javascript",
    name: "Javascript",
    path: `javascript/javascript`,
  },
  html: {
    mode: "html",
    name: "HTML",
    path: "htmlmixed/htmlmixed",
  },
  markdown: {
    mode: "markdown",
    name: "Markdown",
    path: "markdown/markdown",
  },
  css: {
    mode: "css",
    name: "CSS",
    path: "css/css",
  },
  sass: {
    name: "SASS",
    path: "sass/sass",
    mode: "sass",
  },
  rust: {
    name: "Rust",
    path: "rust/rust",
    mode: "rust",
  },
  ruby: {
    name: "Ruby",
    path: "ruby/ruby",
    mode: "ruby",
  },
  python: {
    name: "Python",
    path: "python/python",
    mode: "python",
  },
  jsx: {
    name: "Jsx",
    path: "jsx/jsx",
    mode: "jsx",
  },
  go: {
    name: "Go",
    path: "go/go",
    mode: "go",
  },
  diff: {
    name: "Diff",
    path: "diff/diff",
    mode: "diff",
  },
};
