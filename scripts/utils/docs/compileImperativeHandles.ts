import { parseFromProject, type InterfaceNode } from "@ts-ast-parser/core";
import tsConfig from "../../../tsconfig.json" with { type: "json" };
import { compileImperativeHandle } from "./compileImperativeHandle.ts";
import { join } from "node:path";
import { cwd } from "node:process";

export async function compileImperativeHandles({
  names,
  outputDirName
}: {
  names: string[];
  outputDirName: string;
}) {
  const outputDir = join(cwd(), "public", "generated", outputDirName);

  const result = await parseFromProject(tsConfig);
  const reflectedModules = result.project?.getModules() ?? [];

  const nodes: {
    filePath: string;
    node: InterfaceNode;
  }[] = [];

  names.forEach((name) => {
    reflectedModules.forEach((reflectedModule) => {
      const node = reflectedModule.getDeclarationByName(name);
      if (node) {
        nodes.push({
          filePath: reflectedModule.getSourcePath(),
          node: node as unknown as InterfaceNode
        });
      }
    });
  });

  await Promise.all(
    nodes.map(({ filePath, node }) =>
      compileImperativeHandle({
        filePath,
        interfaceNode: node,
        outputDir
      })
    )
  );
}
