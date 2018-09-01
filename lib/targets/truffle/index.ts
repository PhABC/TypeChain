import { Contract } from "../../parser/abiParser";
import { TsGeneratorPlugin, TContext, TFileDesc } from "ts-generator";
import { join } from "path";
import { extractAbi, parse } from "../../parser/abiParser";
import { getFilename } from "../shared";

export interface ITruffleCfg {
  outDir?: string;
}

const DEFAULT_OUT_PATH = "./types/truffle-contracts/index.d.ts";

export class Truffle extends TsGeneratorPlugin {
  name = "Truffle";

  //tslint:disable-next-line
  private readonly outDirAbs: string;
  private contracts: Contract[] = [];

  constructor(ctx: TContext<ITruffleCfg>) {
    super(ctx);

    const { cwd, rawConfig } = ctx;

    this.outDirAbs = join(cwd, rawConfig.outDir || DEFAULT_OUT_PATH);
  }

  transformFile(file: TFileDesc): TFileDesc | void {
    const abi = extractAbi(file.contents);
    const isEmptyAbi = abi.length === 0;
    if (isEmptyAbi) {
      return;
    }

    const name = getFilename(file.path);

    const contract = parse(abi, name);

    this.contracts.push(contract);
  }

  afterRun(): TFileDesc | void {}
}
