import {
    GROUPED,
    COLLATED,
    ROOM_STATE_INTRO,
    ROOM_STATE_BEGINNER,
    ROOM_STATE_INTER,
    ROOM_STATE_ADVANCED,
    ROOM_STATE_NUKE_INBOUND,
    ROOM_STATE_STIMULATE,
    ROOM_STATE_UPGRADER,
    TIER_1,
    TIER_2,
    TIER_3,
    TIER_4,
    TIER_5,
    TIER_6,
    TIER_7,
    TIER_8,
    ERROR_WARN,
} from "utils/Constants";
import { SpawnHelper } from "Helpers/SpawnHelper";
import SpawnApi from "Api/Spawn.Api"

export class RemoteMinerBodyOptsHelper implements ICreepBodyOptsHelper {

    /**
     * Generate body for remote miner creep
     * @param tier the tier of the room
     */
    public generateCreepBody(tier: TierConstant): BodyPartConstant[] {
        // Default Values for Remote Miner
        let body: CreepBodyDescriptor = { work: 6, carry: 1, move: 3 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        // Cap the remote miner at 6 work parts (6 so they finish mining early and can build/repair their container)
        switch (tier) {
            case TIER_3: // 5 Work, 3 Move - Total Cost: 650
                body = { work: 5, move: 3 };
                break;

            case TIER_8:
            case TIER_7:
            case TIER_6:
            case TIER_5:
            case TIER_4: // 5 Work, 5 Move - Total Cost: 850
                body = { work: 5, move: 5 };
                break;
        }

        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }

    /**
     * Generate options for remote miner creep
     * @param roomState the room state of the room
     */
    public generateCreepOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {
        let creepOptions: CreepOptionsCiv = SpawnHelper.getDefaultCreepOptionsCiv();

        switch (roomState) {
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_NUKE_INBOUND:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_STIMULATE:
                creepOptions = {
                    harvestSources: true,
                    build: true, //
                    repair: true, //
                    fillContainer: true //
                };

                break;
        }

        return creepOptions;
    }
}
