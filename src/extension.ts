import * as vscode from "vscode";

import { PackageReleasesProvider } from "../vscode-release-explorer-core/src/PackageReleasesProvider";
import { RssBot } from "../vscode-release-explorer-core/src/RssBot";

let rssBot: RssBot | null;

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  const provider = new PackageReleasesProvider(rootPath, context);

  rssBot = new RssBot([provider], context);
  rssBot.startAll();

  const treeDataProviderDisposable = vscode.window.registerTreeDataProvider(
    "releaseExplorer.views.dependencies",
    provider
  );
  context.subscriptions.push(treeDataProviderDisposable);

  const openLinkDisposable = vscode.commands.registerCommand(
    "releaseExplorer.commands.openLink",
    (link: string) => vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(link))
  );
  context.subscriptions.push(openLinkDisposable);

  const syncSpinDisposable = vscode.commands.registerCommand(
    "releaseExplorer.commands.syncSpin",
    () => {}
  );
  context.subscriptions.push(syncSpinDisposable);
}

export function deactivate() {
  rssBot?.stopAll();
  rssBot = null;
}
