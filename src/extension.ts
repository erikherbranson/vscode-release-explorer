import * as vscode from "vscode";

import { PackageReleasesProvider, RssBot, makeCommands } from "../vscode-release-explorer-core/src";

let rssBot: RssBot | null;

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  const provider = new PackageReleasesProvider(rootPath, context);

  const commands = makeCommands([provider], context);

  rssBot = new RssBot([provider], context);

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("releaseExplorer.views.dependencies", provider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("releaseExplorer.commands.openLink", commands.openLink)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("releaseExplorer.commands.syncSpin", commands.syncSpin)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("releaseExplorer.commands.delete", commands.deleteTreeItem)
  );
}

export function deactivate() {
  rssBot?.cleanUp();
  rssBot = null;
}
