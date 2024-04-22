import { ContractParams } from "@/contracts/types/contract";
import { persistenceStorage } from "@/persistenceStorage";

export class Query {
  constructor() {}

  async execute(
    contract: string,
    functionName: string,
    args: Array<unknown>
  ): Promise<unknown> {
    const file = persistenceStorage[contract];
    const params = {
      args: args,
      metadata: {
        origin: "query",
        sender: "query",
        blockNumber: 0,
        currentContract: contract,
        transactionHash: "",
        timestamp: 0,
      },
      eventLogger: { log: (event) => {} },
      ecosystem: {
        getContractObj: (contractName: string) => {
          throw new Error("getContractObj not implemented");
        },
        redeployContract: () => {
          throw new Error("redeployContract not implemented");
        },
      },
    } satisfies ContractParams;
    // @ts-ignore
    return file[functionName](params);
  }
}
