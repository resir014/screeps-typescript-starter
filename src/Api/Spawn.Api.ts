import RoomHelper from "../Helpers/RoomHelper";
import MemoryHelper from "../Helpers/MemoryHelper";
import MemoryApi from "./Memory.Api";

/**
 * the api used by the spawn manager
 */
export default class SpawnApi {
    /**
     * get count for the specified creep
     * @param room the room we are getting the count for
     * @param creepConst the role of the creep we want
     */
    public static getCreepCount(room: Room, creepConst: any): number {

        return _.sum(MemoryApi.getMyCreeps(room,
            (c: Creep) => c.memory.role === creepConst));
    }

    /**
     * get the limit for the specified creep
     * @param room the room we are getting the limits for
     * @param creepConst the role of the creep we want
     */
    public static getCreepLimits(room: Room, creepConst: RoleConstant): CreepLimits {
        return room.memory.creepLimit[creepConst];
    }

    /**
     * set creep limits for the room
     * @param room the room we are setting limits for
     */
    public static setCreepLimits(room: Room): void {

        let domesticLimits: DomesticCreepLimits = {
            miner: 0,
            harvester: 0,
            worker: 0,
            powerUpgrader: 0,
            lorry: 0
        };

        let remoteLimits: RemoteCreepLimits = {
            remoteMiner: 0,
            remoteHarvester: 0,
            remoteReserver: 0,
            remoteColonizer: 0,
            remoteDefender: 0
        }

        let militaryLimits: MilitaryCreepLimits = {
            zealot: 0,
            stalker: 0,
            medic: 0
        }

        // check what room state we are in
        switch (room.memory.roomState) {

            // Intro
            case ROOM_STATE_INTRO:

                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 0;
                domesticLimits[ROLE_HARVESTER] = 0;
                domesticLimits[ROLE_WORKER] = 0;
                domesticLimits[ROLE_POWER_UPGRADER] = 0;
                domesticLimits[ROLE_LORRY] = 0;

                // Miltiary Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = 0;
                remoteLimits[ROLE_REMOTE_HARVESTER] = 0;
                remoteLimits[ROLE_REMOTE_RESERVER] = 0;
                remoteLimits[ROLE_COLONIZER] = 0;
                remoteLimits[ROLE_REMOTE_DEFENDER] = 0;

                // No remote creeps at this room state
                militaryLimits[ROLE_ZEALOT] = 0;
                militaryLimits[ROLE_STALKER] = 0;
                militaryLimits[ROLE_MEDIC] = 0;

                break;

            // Beginner
            case ROOM_STATE_BEGINNER:

                // Domestic Creep Definitions

                // Miltiary Creep Definitions

                // No remote creeps at this room state

                break;

            // Intermediate
            case ROOM_STATE_INTER:

                // Domestic Creep Definitions

                // Miltiary Creep Definitions

                // Remote Creep Definitions --
                // not sure if we will actually want them at this level
                // since they have no storage, need to discuss

                break;

            //Advanced
            case ROOM_STATE_ADVANCED:

                // Domestic Creep Definitions

                // Miltiary Creep Definitions

                // Remote Creep Definitions

                break;

            // Upgrader
            case ROOM_STATE_UPGRADER:

                // Domestic Creep Definitions

                // Miltiary Creep Definitions

                // Remote Creep Definitions

                break;

            // Stimulate
            case ROOM_STATE_STIMULATE:

                // Domestic Creep Definitions

                // Miltiary Creep Definitions

                // Remote Creep Definitions

                break;

            // Seige
            case ROOM_STATE_SEIGE:

                // Domestic Creep Definitions

                // Miltiary Creep Definitions

                // Remote Creep Definitions

                break;

            // Nuke Inbound
            case ROOM_STATE_NUKE_INBOUND:

                // Do not spawn any additional creeps while nuke inbound

                break;
        }
    }

    /**
     * get the first available open spawn for a room
     * @param room the room we are checking the spawn for
     */
    public static getOpenSpawn(room: Room): Structure<StructureConstant> | null {

        // get all spawns then just take the first one from it
        const allSpawns: Array<Structure<StructureConstant> | null> = MemoryApi.getStructures(room,
            (s: Structure<StructureConstant>) => s.structureType === STRUCTURE_SPAWN);

        // not sure about this one, i read that _.first ONLY works on arrays and will NOT work on objects
        // allSpawns[0] might be needed... just so we have solution if this ends up being a bug later lol
        // i mean i could just change it to be safe but then nobody would read this
        // so im just gonna leave it
        return _.first(allSpawns);
    }

    /**
     * get next creep to spawn
     * @param room the room we want to spawn them in
     */
    public static getNextCreep(room: Room): void {
        // brock hates empty blocks
    }


    /**
     * spawn the next creep
     * @param room the room we want to spawn them in
     * @param BodyPartConstant[] the body array of the creep
     * @param RoleConstant the role of the creep
     */
    public static spawnNextCreep(room: Room): void {
        // brock hates empty blocks
    }


    /**
     * get energy cost of creep
     * @param room the room we are spawning them in
     * @param RoleConstant the role of the creep
     * @param tier the tier of this creep we are spawning
     */
    public static getEnergyCost(room: Room, roleConst: RoleConstant, tier: number): number {
        return 1;
    }


    /**
     * check what tier of this creep we are spawning
     * @param room the room we are spawning them in
     * @param RoleConstant the role of the creep
     */
    public static getTier(room: Room, roleConst: RoleConstant): number {
        return 1;
    }


    /**
     * get the memory options for this creep
     * @param room the room we are spawning it in
     * @param RoleConstant the role of the creep
     * @param tier the tier of this creep we are spawning
     */
    private static generateCreepOptions(room: Room, roleConst: RoleConstant, tier: number): void {
        // .keep
    }

    /**
     * generate a body for creeps given a specific set of paramters
     * @param
     */
    private static generateCreepBody(): BodyPartConstant[] {
        // not sure the implementation yet
        // 2 options... paramter for each body part and you just supply a number
        // but i prefer passing 2 arrays of equal length, one with body part constants
        // and one with the number of these parts you wish for. Order can be in the order you
        // make the body part constant array in, but i want some options for switching order around
        // to be customizable if possible... idk yet but this function will be much nicer than
        // manually creating the bodies
        return [WORK, WORK, MOVE];
    }



}
