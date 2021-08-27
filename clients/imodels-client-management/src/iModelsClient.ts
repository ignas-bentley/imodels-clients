/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { RecursiveRequired, iModelsErrorParser, RestClient, AxiosRestClient } from "./base";
import { iModelOperations } from "./operations/imodel/iModelOperations";

export interface BackendOptions {
  baseUri?: string;
  apiVersion?: string;
}

export interface iModelsClientOptions {
  restClient?: RestClient;
  backendOptions?: BackendOptions;
}

export class iModelsClient {
  private _options: RecursiveRequired<iModelsClientOptions>;

  constructor(options?: iModelsClientOptions) {
    this._options = fillConfiguration(options);
  }

  public get iModels(): iModelOperations {
    return new iModelOperations(this._options);
  }
}

export function fillConfiguration(options?: iModelsClientOptions): RecursiveRequired<iModelsClientOptions> {
  return {
    restClient: options?.restClient ?? new AxiosRestClient(iModelsErrorParser.parse),
    backendOptions: {
      baseUri: options?.backendOptions?.baseUri ?? "https://api.bentley.com/imodels",
      apiVersion: options?.backendOptions?.apiVersion ?? "v1",
    }
  };
}
