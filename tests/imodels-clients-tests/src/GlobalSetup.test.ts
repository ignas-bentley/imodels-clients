/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { iModelsClient } from "@itwin/imodels-client-authoring";
import { Config, Constants, TestAuthenticationProvider, TestClientOptions, TestProjectProvider, TestiModelGroup, cleanUpiModels, cleanupDirectory } from "./common";

before(async () => {
  const imodelsClient = new iModelsClient(new TestClientOptions());
  const requestContext = await TestAuthenticationProvider.getRequestContext(Config.get().testUsers.user1);
  const projectId = await TestProjectProvider.getProjectId();
  const testiModelGroup = new TestiModelGroup({ labels: { package: Constants.PackagePrefix } });

  await cleanUpiModels({ imodelsClient, requestContext, projectId, testiModelGroup });
  cleanupDirectory(Constants.TestDownloadDirectoryPath);
});

after(async () => {
  const imodelsClient = new iModelsClient(new TestClientOptions());
  const requestContext = await TestAuthenticationProvider.getRequestContext(Config.get().testUsers.user1);
  const projectId = await TestProjectProvider.getProjectId();
  const testiModelGroup = new TestiModelGroup({ labels: { package: Constants.PackagePrefix } });

  await cleanUpiModels({ imodelsClient, requestContext, projectId, testiModelGroup });

  cleanupDirectory(Constants.TestDownloadDirectoryPath);
});


