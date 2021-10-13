/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as fs from "fs";
import { expect } from "chai";
import { Briefcase, BriefcaseProperties, ChangesetProperties, Checkpoint, CheckpointState, DownloadedChangeset } from "@itwin/imodels-client-authoring";
import { BaseEntity, Changeset, ChangesetState, NamedVersion, NamedVersionPropertiesForCreate, NamedVersionState, iModel, iModelProperties, iModelState, iModelsError, iModelsErrorDetail } from "@itwin/imodels-client-management";
import { TestiModelMetadata } from "./TestiModelMetadata";

export function assertBaseEntity(actualEntity: BaseEntity): void {
  expect(actualEntity).to.not.be.undefined;
  expect(actualEntity.id).to.not.be.empty;
  expect(actualEntity.displayName).to.not.be.empty;
}

export async function assertCollection<T extends BaseEntity>(params: {
  asyncIterable: AsyncIterableIterator<T>,
  isEntityCountCorrect: (count: number) => boolean
}): Promise<void> {
  let entityCount = 0;
  for await (const entity of params.asyncIterable) {
    assertBaseEntity(entity);
    entityCount++;
  }
  expect(params.isEntityCountCorrect(entityCount)).to.equal(true);
}

export function assertiModel(params: {
  actualiModel: iModel,
  expectediModelProperties: iModelProperties
}): void {
  assertBaseEntity(params.actualiModel);

  expect(params.actualiModel.name).to.equal(params.expectediModelProperties.name);
  assertOptionalProperty(params.expectediModelProperties.description, params.actualiModel.description);
  assertOptionalProperty(params.expectediModelProperties.extent, params.actualiModel.extent);
  expect(params.actualiModel.createdDateTime as Date).to.not.be.undefined;
  expect(params.actualiModel.state).to.equal(iModelState.Initialized);
}

export function assertBriefcase(params: {
  actualBriefcase: Briefcase,
  expectedBriefcaseProperties: BriefcaseProperties & { briefcaseId?: number }
}): void {
  assertBaseEntity(params.actualBriefcase);

  if (params.expectedBriefcaseProperties.briefcaseId)
    expect(params.actualBriefcase.briefcaseId).to.equal(params.expectedBriefcaseProperties.briefcaseId);
  else
    expect(params.actualBriefcase.briefcaseId).to.be.greaterThan(0);

  expect(params.actualBriefcase.fileSize).to.be.greaterThan(0);
  assertOptionalProperty(params.expectedBriefcaseProperties?.deviceName, params.actualBriefcase.deviceName);
  expect(params.actualBriefcase.acquiredDateTime as Date).to.not.be.undefined;
}

export function assertChangeset(params: {
  actualChangeset: Changeset,
  expectedChangesetProperties: Partial<ChangesetProperties>
}): void {
  assertBaseEntity(params.actualChangeset);

  expect(params.actualChangeset.parentId).to.equal(params.expectedChangesetProperties.parentId ?? "");
  expect(params.actualChangeset.index).to.be.greaterThan(0);
  expect(params.actualChangeset.briefcaseId).to.be.greaterThan(0);
  assertOptionalProperty(params.expectedChangesetProperties.description, params.actualChangeset.description);
  expect(params.actualChangeset.pushDateTime as Date).to.not.be.undefined;
  expect(params.actualChangeset.state).to.equal(ChangesetState.FileUploaded);
  expect(params.actualChangeset.synchronizationInfo).to.equal(null);

  // check if the changeset.fileSize property matches the size of the changeset file used for test iModel creation
  const expecteChangesetMetadata = TestiModelMetadata.Changesets.find(changeset => changeset.id === params.expectedChangesetProperties.id)
  expect(params.actualChangeset.fileSize).to.equal(fs.statSync(expecteChangesetMetadata!.changesetFilePath).size);

  // TODO: add correct expected value when test client is set up
  // expect(params.actualChangeset.application).to.equal(null);
}

export function assertDownloadedChangeset(params: {
  actualChangeset: DownloadedChangeset,
  expectedChangesetProperties: Partial<ChangesetProperties>
}): void {
  assertChangeset(params);

  expect(fs.existsSync(params.actualChangeset.filePath)).to.equal(true);

  // check if the downloaded file size matches the size of the changeset file used for test iModel creation
  const expecteChangesetMetadata = TestiModelMetadata.Changesets.find(changeset => changeset.id === params.expectedChangesetProperties.id)
  expect(fs.statSync(params.actualChangeset.filePath).size).to.equal(fs.statSync(expecteChangesetMetadata!.changesetFilePath).size);
}

export function assertNamedVersion(params: {
  actualNamedVersion: NamedVersion,
  expectedNamedVersionProperties: NamedVersionPropertiesForCreate
}): void {
  assertBaseEntity(params.actualNamedVersion);
  expect(params.actualNamedVersion.name).to.equal(params.expectedNamedVersionProperties.name);
  assertOptionalProperty(params.expectedNamedVersionProperties.description, params.actualNamedVersion.description);
  assertOptionalProperty(params.expectedNamedVersionProperties.changesetId, params.actualNamedVersion.changesetId);
  expect(params.actualNamedVersion.state).to.equal(NamedVersionState.Visible);
}

export function assertCheckpoint(params: {
  actualCheckpoint: Checkpoint,
  expectedCheckpointProperties: {
    changesetId: string,
    changesetIndex: number
    state: CheckpointState
  }
}): void {
  expect(params.actualCheckpoint.changesetId).to.equal(params.expectedCheckpointProperties.changesetId);
  expect(params.actualCheckpoint.changesetIndex).to.equal(params.expectedCheckpointProperties.changesetIndex);
  expect(params.actualCheckpoint.state).to.equal(params.expectedCheckpointProperties.state);
  expect(params.actualCheckpoint._links?.download).to.not.be.undefined;
}

export function assertError(params: { actualError: Error, expectedError: Partial<iModelsError> }): void {
  const imodelsError = params.actualError as iModelsError;

  expect(imodelsError).to.not.be.undefined;
  expect(imodelsError.code).to.equal(params.expectedError.code);
  expect(imodelsError.name).to.equal(params.expectedError.code);
  expect(imodelsError.message).to.equal(params.expectedError.message);

  if (params.expectedError.details) {
    expect(imodelsError.details).to.not.be.undefined;
    expect(imodelsError.details!.length).to.equal(params.expectedError.details.length);

    for (const expectedDetail of params.expectedError.details) {
      const detailVerificationFunc = (detail: iModelsErrorDetail) =>
        detail.code === expectedDetail.code &&
        detail.message === expectedDetail.message &&
        detail.target === expectedDetail.target;
      expect(imodelsError.details!.find(detailVerificationFunc)).to.not.be.undefined;
    }
  } else {
    expect(imodelsError.details).to.be.undefined;
  }
}

function assertOptionalProperty<TPropertyType>(expectedValue: TPropertyType, actualValue: TPropertyType): void {
  if (expectedValue)
    expect(actualValue).to.deep.equal(expectedValue);
  else
    expect(actualValue).to.equal(null);
}
