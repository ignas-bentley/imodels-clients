/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { iModelsClient as AuthoringiModelsClient } from "@itwin/imodels-client-authoring";
import { iModel, iModelsClient as ManagementiModelsClient } from "@itwin/imodels-client-management";
import { TestContext } from "./TestContext";

export class TestSetupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TestSetupFailed";
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createEmptyiModel(params: {
  imodelsClient: ManagementiModelsClient | AuthoringiModelsClient,
  testContext: TestContext,
  imodelName: string
}): Promise<iModel> {
  return params.imodelsClient.iModels.createEmpty({
    requestContext: params.testContext.RequestContext,
    imodelProperties: {
      projectId: params.testContext.ProjectId,
      name: params.imodelName
    }
  });
}

export async function cleanUpiModels(params: {
  imodelsClient: ManagementiModelsClient | AuthoringiModelsClient,
  testContext: TestContext
}): Promise<void> {
  const imodels = params.imodelsClient.iModels.getMinimalList({
    requestContext: params.testContext.RequestContext,
    urlParams: {
      projectId: params.testContext.ProjectId
    }
  });

  for await (const imodel of imodels)
    if (params.testContext.doesiModelBelongToContext(imodel.displayName))
      await params.imodelsClient.iModels.delete({
        requestContext: params.testContext.RequestContext,
        imodelId: imodel.id
      });
}

export async function findiModelWithName(params: {
  imodelsClient: ManagementiModelsClient | AuthoringiModelsClient,
  testContext: TestContext,
  expectediModelname: string
}): Promise<iModel> {
  const imodels = params.imodelsClient.iModels.getRepresentationList({
    requestContext: params.testContext.RequestContext,
    urlParams: {
      projectId: params.testContext.ProjectId
    }
  });

  for await (const imodel of imodels)
    if (imodel.displayName === params.expectediModelname)
      return imodel;

  return undefined;
}
