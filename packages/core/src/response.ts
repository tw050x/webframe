import { ServerResponse } from "node:http";
import type ContextualIncomingMessage from "./request.js";

/**
 * HTML to send: a string, a promise of one (what `@kitajs/html` gives for JSX), or a stream
 * (such as `renderToStream` from `@kitajs/html/suspense`).
 */
export type Html = string | PromiseLike<string> | NodeJS.ReadableStream;

/**
 * The response, with a method for each response a service commonly sends.
 *
 * Redirects to an htmx request (`HX-Request: true`) are sent with `HX-Redirect` in place of
 * `Location`, so htmx loads the page rather than swapping it into the one showing.
 */
export default class ContextualServerResponse extends ServerResponse<ContextualIncomingMessage> {

  constructor(request: ContextualIncomingMessage) {
    super(request);
  }

  private sent = false;

  /**
   * Whether a response is being sent or has been: once it is, the middleware chain stops.
   * True after any of the send methods, and after headers are written or the response ended
   * any other way.
   */
  get sendingOrSent(): boolean {
    return this.sent || this.headersSent || this.writableEnded;
  }

  /** Sends text with a status. */
  sendText(statusCode: number, text: string): void {
    this.sent = true;
    this.statusCode = statusCode;
    this.setHeader('Content-Type', 'text/plain; charset=utf-8');
    this.end(text);
  }

  /** Sends a value as JSON with a status. */
  sendJSON(statusCode: number, body: unknown): void {
    this.sent = true;
    this.statusCode = statusCode;
    this.setHeader('Content-Type', 'application/json; charset=utf-8');
    this.end(JSON.stringify(body));
  }

  /** Sends HTML with a status. A promise or stream that fails ends the response. */
  sendHTML(statusCode: number, html: Html): void {
    this.sent = true;
    this.statusCode = statusCode;
    this.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (typeof html === 'string') {
      this.end(html);
    }
    else if ('then' in html) {
      html.then(
        (text) => this.end(text),
        () => this.destroy(),
      );
    }
    else {
      html.on('error', () => this.destroy());
      html.pipe(this);
    }
  }

  /** Sends a redirect with a status. */
  sendRedirect(statusCode: 301 | 302 | 303 | 307 | 308, url: URL | string, text = 'Redirecting...'): void {
    this.sent = true;
    this.statusCode = statusCode;
    this.setHeader('Content-Type', 'text/plain; charset=utf-8');
    this.setHeader(this.req.headers['hx-request'] === 'true' ? 'HX-Redirect' : 'Location', url.toString());
    this.end(text);
  }

  // 2xx

  sendOKTextResponse(text = 'ok'): void { this.sendText(200, text); }
  sendOKJSONResponse(body: unknown = { message: 'ok' }): void { this.sendJSON(200, body); }
  sendOKHTMLResponse(html: Html): void { this.sendHTML(200, html); }
  sendCreatedJSONResponse(body: unknown = { message: 'created' }): void { this.sendJSON(201, body); }
  sendAcceptedJSONResponse(body: unknown = { message: 'accepted' }): void { this.sendJSON(202, body); }

  /** Sends 204 No Content, which has no body. */
  sendNoContentResponse(): void {
    this.sent = true;
    this.statusCode = 204;
    this.end();
  }

  // 3xx

  sendMovedPermanentlyRedirect(url: URL | string): void { this.sendRedirect(301, url, `Moved Permanently to ${url}`); }
  sendFoundRedirect(url: URL | string): void { this.sendRedirect(302, url); }
  sendMovedTemporarilyRedirect(url: URL | string): void { this.sendRedirect(302, url, `Moved Temporarily to ${url}`); }
  sendSeeOtherRedirect(url: URL | string): void { this.sendRedirect(303, url); }

  // 4xx

  sendBadRequestJSONResponse(body: unknown = { message: 'bad request' }): void { this.sendJSON(400, body); }
  sendBadRequestHTMLResponse(html: Html): void { this.sendHTML(400, html); }
  sendUnauthorizedJSONResponse(body: unknown = { message: 'unauthorized' }): void { this.sendJSON(401, body); }
  sendUnauthorizedHTMLResponse(html: Html): void { this.sendHTML(401, html); }
  sendForbiddenTextResponse(text = 'Forbidden'): void { this.sendText(403, text); }
  sendForbiddenHTMLResponse(html: Html): void { this.sendHTML(403, html); }
  sendNotFoundTextResponse(text = '404 page not found'): void { this.sendText(404, text); }
  sendNotFoundJSONResponse(body: unknown = { message: 'not found' }): void { this.sendJSON(404, body); }
  sendNotFoundHTMLResponse(html: Html): void { this.sendHTML(404, html); }

  // 5xx

  sendInternalServerErrorTextResponse(text = 'Internal Server Error'): void { this.sendText(500, text); }
  sendInternalServerErrorJSONResponse(body: unknown = { message: 'internal server error' }): void { this.sendJSON(500, body); }
  sendInternalServerErrorHTMLResponse(html: Html): void { this.sendHTML(500, html); }
  sendNotImplementedTextResponse(text = 'Not Implemented'): void { this.sendText(501, text); }
}
