import { z } from "zod";
import { argsParsing } from "@/contracts/utils/args-parsing";
import { Contract, ContractParams } from "@/contracts/types/contract";
import { zUtils } from "@/contracts/utils/zod";
import { TokenHelper } from "@/contracts/utils/token-helper";
import { ExecutionError } from "@/contracts/types/execution-error";

export default class CoinFlip implements Contract {
  activeOn = 1;
  games = new Map<string, bigint>();

  flip = async ({ metadata, eventLogger, ecosystem, args }: ContractParams) => {
    const schema = z.tuple([zUtils.bigint()]);
    const player = metadata.sender;
    const [bet] = argsParsing(schema, args, "flip");

    const pusdToken = new TokenHelper("pusd", ecosystem);
    await pusdToken.transferFrom(player, "coinflip", bet);

    this.games.set(player, bet);

    eventLogger.log({
      type: "flip",
      message: `${player} bet ${bet} $PUSD and flip`,
    });
  };

  claim = async ({
    metadata,
    eventLogger,
    ecosystem,
    args,
  }: ContractParams) => {
    const schema = z.tuple([zUtils.bigint(), zUtils.bigint()]);
    const player = metadata.sender;
    const [seed, host_seed] = argsParsing(schema, args, "claim");

    const betAmount = this.games.get(player);
    if (!betAmount) {
      throw new ExecutionError("game not existed");
    }

    const is_win = (host_seed | seed) % 2n === 0n;
    if (is_win) {
      const pusdToken = new TokenHelper("pusd", ecosystem);
      await pusdToken.transfer(player, betAmount * 2n);
    }

    this.games.delete(player);

    eventLogger.log({
      type: "claim",
      message: `${player} guess ${seed % 2n === 0n ? "head" : "tail"} and ${is_win ? "win" : "lose"}`,
    });
  };
}
