import * as rasterizeHTML from "rasterizehtml";
import { changeDpiDataUrl } from "changedpi";

export class HtmlRenderer {
  constructor(private documentEl: Document) {}

  renderElement(el: HTMLDivElement, scale: number = 1) {
    // Create and append canvas to document
    const canvasEl = this.documentEl.createElement("canvas");
    const elRect = el.getBoundingClientRect();
    canvasEl.width = elRect.width * window.devicePixelRatio;
    canvasEl.height = elRect.height * window.devicePixelRatio;
    canvasEl.style.display = `none`;
    this.documentEl.body.appendChild(canvasEl);

    // Configure canvas context
    const backingScale = this.documentEl.defaultView?.devicePixelRatio ?? 1;
    const canvasContext = canvasEl.getContext("2d")!;
    canvasContext.resetTransform();
    canvasContext.scale(backingScale, backingScale);

    // Clone current document
    const clonedDocument: Document = window.document.cloneNode(true) as Document;

    // set some custom styles
    const customStyle = clonedDocument.createElement("style");
    customStyle.textContent = `
      .body {
        color: rgb(255, 255, 255);
        background: rgb(32, 32, 32);
        font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu;
        font-weight: 400;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
      }
      .cm-scroller {
        overflow: hidden !important; /* hide any scrollbar */
      }
      `;
    clonedDocument.head.appendChild(customStyle);

    // Set document's body
    clonedDocument.body.innerHTML = "";
    clonedDocument.body.className = clonedDocument.body.className + " body";
    clonedDocument.body.appendChild(el.cloneNode(true));

    rasterizeHTML
      .drawDocument(clonedDocument, null as unknown as HTMLCanvasElement, {
        width: elRect.width,
        height: elRect.height,
        executeJs: false,
      })
      .then((renderResult) => {
        // draw image to canvas and create data url
        canvasContext.drawImage(renderResult.image, 0, 0);
        const dataUrl = canvasEl.toDataURL("img/png");
        const hiDpiDataUrl = changeDpiDataUrl(dataUrl, 72 * backingScale);

        // start the download
        const link = document.createElement("a");
        link.href = hiDpiDataUrl;
        link.download = "sippet.png";
        link.click();

        // remove canvas
        this.documentEl.body.removeChild(canvasEl);
      });
  }
}
