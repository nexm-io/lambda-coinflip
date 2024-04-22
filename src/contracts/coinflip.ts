import { z } from "zod";
import { argsParsing } from "@/contracts/utils/args-parsing";
import { Contract, ContractParams } from "@/contracts/types/contract";
import { zUtils } from "@/contracts/utils/zod";
import { TokenHelper } from "@/contracts/utils/token-helper";
import { ExecutionError } from "@/contracts/types/execution-error";

type Game = {
  player: string;
  is_win?: boolean;
  host_seed?: bigint;
  seed: bigint;
  bet: bigint;
};

export default class CoinFlip implements Contract {
  activeOn = 1;
  games = new Map<string, Game>();

  flip = async ({ metadata, eventLogger, ecosystem, args }: ContractParams) => {
    const schema = z.tuple([zUtils.bigint(), zUtils.bigint()]);
    const player = metadata.sender;
    const [bet, seed] = argsParsing(schema, args, "flip");

    const pusdToken = new TokenHelper("pusd", ecosystem);
    await pusdToken.transferFrom(player, "House", bet);

    this.games.set(metadata.transactionHash, {
      player,
      seed,
      bet,
    });

    eventLogger.log({
      type: "flip",
      message: `${player} bet ${bet} $PUSD for the game ${metadata.transactionHash} with seed ${seed}`,
    });
  };

  claim = async ({
    metadata,
    eventLogger,
    ecosystem,
    args,
  }: ContractParams) => {
    const schema = z.tuple([z.string(), zUtils.bigint()]);
    const player = metadata.sender;
    const [game, host_seed] = argsParsing(schema, args, "claim");

    const gameData = this.games.get(game);
    if (!gameData) {
      throw new ExecutionError("game not existed");
    }
    if (gameData.is_win !== undefined) {
      throw new ExecutionError("game ended");
    }

    const is_win = (host_seed | gameData.seed) % 2n === 0n;
    if (is_win) {
      const pusdToken = new TokenHelper("pusd", ecosystem);
      await pusdToken.transferFrom(player, "House", gameData.bet * 2n);
    }

    this.games.set(game, {
      ...gameData,
      host_seed,
      is_win,
    });

    eventLogger.log({
      type: "claim",
      message: `${player} check result of game ${game} and ${is_win ? "win" : "lose"}`,
    });
  };
}
