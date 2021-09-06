/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { CollectionRequestParams, Extent, RequestContextParam } from "../../base";

export interface GetiModelListParams extends RequestContextParam {
  urlParams: { projectId: string } & CollectionRequestParams;
}

export interface GetiModelByIdParams extends RequestContextParam {
  imodelId: string;
}

export interface iModelProperties {
  projectId: string;
  name: string;
  description?: string;
  extent?: Extent;
}

export interface CreateEmptyiModelParams extends RequestContextParam {
  imodelProperties: iModelProperties;
}

export interface DeleteiModelParams extends RequestContextParam {
  imodelId: string;
}
