/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export class Constants {
  public static api = {
    baseUrl: "https://api.bentley.com/imodels",
    version: "itwin-platform.v1"
  }

  public static headers = {
    accept: "Accept",
    authorization: "Authorization",
    contentType: "ContentType",
    prefer: "Prefer",

    values: {
      contentType: "application/json"
    }
  }
}
