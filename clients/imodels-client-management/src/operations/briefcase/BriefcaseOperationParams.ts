/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { CollectionRequestParams, iModelScopedOperationParams } from "../../base";

export const SPECIAL_VALUES_ME = "me";

export type ValidOwnerIdValue = typeof SPECIAL_VALUES_ME;

export interface GetBriefcaseListUrlParams extends CollectionRequestParams {
  ownerId?: ValidOwnerIdValue;
}

export interface GetBriefcaseListParams extends iModelScopedOperationParams {
  urlParams?: GetBriefcaseListUrlParams;
}

export interface GetSingleBriefcaseParams extends iModelScopedOperationParams {
  briefcaseId: number;
}
