/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { AcquireBriefcaseParams, Briefcase, RequestContext, iModel, iModelsClient } from "@itwin/imodels-client-authoring";
import { Constants, TestAuthenticationProvider, TestClientOptions, TestProjectProvider, TestiModelGroup, TestiModelMetadata, cleanUpiModels, createEmptyiModel, Config } from "../common";
import { assertBriefcase } from "../common/AssertionUtils";

describe("[Authoring] BriefcaseOperations", () => {
  let imodelsClient: iModelsClient;
  let requestContext: RequestContext;
  let projectId: string;
  let testiModelGroup: TestiModelGroup;
  let testiModel: iModel;

  before(async () => {
    imodelsClient = new iModelsClient(new TestClientOptions());
    requestContext = await TestAuthenticationProvider.getRequestContext(Config.get().testUsers.user1);
    projectId = await TestProjectProvider.getProjectId();
    testiModelGroup = new TestiModelGroup({
      labels: {
        package: Constants.PackagePrefix,
        testSuite: "AuthoringBriefcaseOperations"
      }
    });

    testiModel = await createEmptyiModel({
      imodelsClient,
      requestContext,
      projectId,
      imodelName: testiModelGroup.getPrefixediModelName("Test iModel for write")
    });
  });

  after(async () => {
    await cleanUpiModels({ imodelsClient, requestContext, projectId, testiModelGroup });
  });

  it("should acquire briefcase", async () => {
    // Arrange
    const acquireBriefcaseParams: AcquireBriefcaseParams = {
      requestContext,
      imodelId: testiModel.id,
      briefcaseProperties: {
        deviceName: TestiModelMetadata.Briefcase.deviceName
      }
    };

    // Act
    const briefcase: Briefcase = await imodelsClient.Briefcases.acquire(acquireBriefcaseParams);

    // Assert
    assertBriefcase({
      actualBriefcase: briefcase,
      expectedBriefcaseProperties: acquireBriefcaseParams.briefcaseProperties!
    });
  });
});
