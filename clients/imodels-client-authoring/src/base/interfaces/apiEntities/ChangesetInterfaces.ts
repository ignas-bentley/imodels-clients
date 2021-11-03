/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { MinimalChangeset } from "@itwin/imodels-client-management";
import { DownloadedFileProps } from "../CommonInterfaces";

export type DownloadedChangeset = MinimalChangeset & DownloadedFileProps;
