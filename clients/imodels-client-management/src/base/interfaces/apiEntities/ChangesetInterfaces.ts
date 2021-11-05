/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { CollectionResponse, Link } from "../CommonInterfaces";
import { Checkpoint } from "./CheckpointInterfaces";
import { NamedVersion } from "./NamedVersionInterfaces";

export enum ChangesetState {
  WaitingForFile = "waitingForFile",
  FileUploaded = "fileUploaded"
}

export enum ContainingChanges {
  Regular           = 0,
  Schema            = 1 << 0,
  Definition        = 1 << 1,
  SpatialData       = 1 << 2,
  SheetsAndDrawings = 1 << 3,
  ViewsAndModels    = 1 << 4,
  GlobalProperties  = 1 << 5
}

export interface Application {
  name: string;
}

export interface SynchronizationInfo {
  changedFiles: string[];
}

export interface ChangesetLinks {
  upload: Link;
  download: Link;
  complete: Link;
  namedVersion?: Link;
  currentOrPrecedingCheckpoint?: Link;
}

export interface MinimalChangeset {
  id: string;
  displayName: string;
  description: string;
  index: number;
  parentId: string;
  pushDateTime: Date;
  state: ChangesetState;
  containingChanges: ContainingChanges;
  fileSize: number;
  briefcaseId: number;
}

export interface Changeset extends MinimalChangeset {
  application: Application | null;
  synchronizationInfo: SynchronizationInfo | null;
  _links: ChangesetLinks;
  getNamedVersion: () => Promise<NamedVersion | undefined>;
  getCurrentOrPrecedingCheckpoint: () => Promise<Checkpoint | undefined>;
}

export interface ChangesetResponse {
  changeset: Changeset;
}

export interface MinimalChangesetsResponse extends CollectionResponse {
  changesets: MinimalChangeset[];
}

export interface ChangesetsResponse extends CollectionResponse {
  changesets: Changeset[];
}

