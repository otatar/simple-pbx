import { data } from "react-router";

/**
 * This helper function helps us to return the accurate HTTP status,
 * 400 Bad Request, to the client.
 */
export const badRequest = <T>(receivedData: T) =>
  data<T>(receivedData, { status: 400 });

export const okRequest = <T>(receivedData: T) =>
  new Response(JSON.stringify(<T>receivedData), { status: 200 });

export const notFoundResource = (msg: string) => data(msg, { status: 404 });
