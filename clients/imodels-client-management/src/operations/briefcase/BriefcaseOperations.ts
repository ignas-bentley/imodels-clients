/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Briefcase, BriefcaseResponse, BriefcasesResponse, MinimalBriefcase, OperationsBase, PreferReturn, getCollectionIterator } from "../../base";
import { OperationOptions } from "../OperationOptions";
import { GetSingleBriefcaseParams, GetBriefcaseListParams } from "./BriefcaseOperationParams";

export class BriefcaseOperations<TOptions extends OperationOptions> extends OperationsBase<TOptions> {
  public getMinimalList(params: GetBriefcaseListParams): AsyncIterableIterator<MinimalBriefcase> {
    return getCollectionIterator(() => this.getSingleCollectionPage<MinimalBriefcase>({
      authorization: params.authorization,
      url: `${this._options.urlFormatter.baseUri}/${params.imodelId}/briefcases${this.formQueryString({ ...params.urlParams })}`,
      preferReturn: PreferReturn.Minimal,
      entityCollectionAccessor: (response: unknown) => (response as BriefcasesResponse<MinimalBriefcase>).briefcases
    }));
  }

  public getRepresentationList(params: GetBriefcaseListParams): AsyncIterableIterator<Briefcase> {
    return getCollectionIterator(() => this.getSingleCollectionPage<Briefcase>({
      authorization: params.authorization,
      url: `${this._options.urlFormatter.baseUri}/${params.imodelId}/briefcases${this.formQueryString({ ...params.urlParams })}`,
      preferReturn: PreferReturn.Representation,
      entityCollectionAccessor: (response: unknown) => (response as BriefcasesResponse<Briefcase>).briefcases
    }));
  }

  public async getSingle(params: GetSingleBriefcaseParams): Promise<Briefcase> {
    const response = await this.sendGetRequest<BriefcaseResponse>({
      authorization: params.authorization,
      url: `${this._options.urlFormatter.baseUri}/${params.imodelId}/briefcases/${params.briefcaseId}`
    });
    return response.briefcase;
  }
}
