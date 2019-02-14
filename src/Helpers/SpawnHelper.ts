import UtilHelper from "./UtilHelper";
import SpawnApi from "Api/Spawn.Api";
import { GROUPED, COLLATED } from "utils/Constants";

/**
 * Functions to help keep Spawn.Api clean go here
 */
export class SpawnHelper {
    /**
     * Returns a boolean indicating if the object is a valid creepBody descriptor
     * @param bodyObject The description of the creep body to verify
     */
    public static verifyDescriptor(bodyObject: CreepBodyDescriptor): boolean {
        const partNames = Object.keys(bodyObject);
        let valid: boolean = true;
        // Check that no body parts have a definition of 0 or negative
        for (const part in partNames) {
            if (bodyObject[part] <= 0) {
                valid = false;
            }
            // if (!(part in BODYPARTS_ALL)) {
            // * Technically invalid for testing atm - Need to fix
            //     valid = false;
            // }
        }
        return valid;
    }

    /**
     * Helper function - Returns an array containing @numParts of @part
     * @part The part to create
     * @numParts The number of parts to create
     */
    public static generateParts(part: BodyPartConstant, numParts: number): BodyPartConstant[] {
        const returnArray: BodyPartConstant[] = [];
        for (let i = 0; i < numParts; i++) {
            returnArray.push(part);
        }
        return returnArray;
    }

    /**
     * Groups the body parts -- e.g. WORK, WORK, CARRY, CARRY, MOVE, MOVE
     * @param descriptor A StringMap of creepbody limits -- { MOVE: 3, CARRY: 2, ... }
     */
    public static getBody_Grouped(descriptor: CreepBodyDescriptor): BodyPartConstant[] {
        const creepBody: BodyPartConstant[] = [];
        _.forEach(Object.keys(descriptor), (part: BodyPartConstant) => {
            // Having ! after property removes 'null' and 'undefined'
            for (let i = 0; i < descriptor[part]!; i++) {
                creepBody.push(part);
            }
        });
        return creepBody;
    }

    /**
     * Collates the body parts -- e.g. WORK, CARRY, MOVE, WORK, CARRY, ...
     * @param descriptor A StringMap of creepbody limits -- { MOVE: 3, CARRY: 2, ... }
     */
    public static getBody_Collated(descriptor: CreepBodyDescriptor): BodyPartConstant[] {
        const returnParts: BodyPartConstant[] = [];
        const numParts: number = _.sum(_.values(descriptor));
        const partNames = <BodyPartConstant[]>Object.keys(descriptor);

        let i = 0;
        while (i < numParts) {
            for (let j = 0; j < partNames.length; j++) {
                const currPart: BodyPartConstant = partNames[j];
                if (descriptor[currPart]! >= 1) {
                    returnParts.push(currPart);
                    descriptor[currPart]!--;
                    i++;
                }
            }
        }
        return returnParts;
    }

    /**
     * Generates a creep name in the format role_tier_uniqueID
     * @param role The role of the creep being generated
     * @param tier The tier of the creep being generated
     */
    public static generateCreepName(role: RoleConstant, tier: TierConstant): string {
        const modifier: string = Game.time.toString().slice(4);
        const name = role + "_" + tier + "_" + modifier;
        return name;
    }

    // Domestic ----
    /**
     * Generate body for miner creep
     * @param tier The tier of the room
     */
    public static generateMinerBody(tier: TierConstant): BodyPartConstant[] | undefined {
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1: // 2 Work, 2 Move - Total Cost: 300
                body = { work: 2, move: 2 };
                opts.mixType = COLLATED; // Just as an example of how we could change opts by tier as well
                break;

            case TIER_2: // 5 Work, 1 Move - Total Cost: 550
                body = { work: 5, move: 1 };
                break;

            case TIER_3 || TIER_4 || TIER_5 || TIER_6 || TIER_7 || TIER_8: // 5 Work, 2 Move - Total Cost: 600
                body = { work: 5, move: 2 };
                break;
        }

        // Generate the creep body based on the body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for miner creep
     * @param tier the tier of the room
     */
    public static generateMinerOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {

        let creepOptions: CreepOptionsCiv = this.getDefaultCreepOptionsCiv();

        // Miners are unique in that they are focused on what job no matter what
        // This is reflected in almost all their options being default values
        switch (roomState) {
            case ROOM_STATE_INTRO || ROOM_STATE_BEGINNER || ROOM_STATE_INTER
                || ROOM_STATE_ADVANCED || ROOM_STATE_UPGRADER || ROOM_STATE_STIMULATE
                || ROOM_STATE_SEIGE || ROOM_STATE_NUKE_INBOUND || ROOM_STATE_SEIGE:
                creepOptions = {
                    build: false,
                    upgrade: false,
                    repair: false,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: false,
                    fillContainer: true,        //
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: false,
                    getDroppedEnergy: false,
                    getFromLink: false,
                    getFromTerminal: false,
                };

                break;
        }

        return creepOptions;
    }

    /**
     * Generate body for Harvester creep
     * @param tier the tier of the room
     */
    public static generateHarvesterBody(tier: TierConstant): BodyPartConstant[] | undefined {
        // Default Values for harvester
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1: // 1 Work, 2 Carry, 2 Move - Total Cost: 300
                body = { work: 1, carry: 2, move: 2 };
                break;

            case TIER_2: // 2 Work, 5 Carry, 3 Move - Total Cost: 550
                body = { work: 2, carry: 5, move: 3 };
                break;

            case TIER_3: // 2 Work, 6 Carry, 6 Move - Total Cost: 800
                body = { work: 2, carry: 6, move: 6 };
                break;

            case TIER_4: // 2 Work, 11 Carry, 11 Move - Total Cost: 1300
                body = { work: 2, carry: 11, move: 11 };
                break;

            case TIER_5: // 2 Work, 16 Carry, 16 Move - Total Cost: 1800
                body = { work: 2, carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8: // 2 Work, 20 Carry, 20 Move - Total Cost: 2200
                body = { work: 2, carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for harvester creep
     * @param tier the tier of the room
     */
    public static generateHarvesterOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {

        let creepOptions: CreepOptionsCiv = this.getDefaultCreepOptionsCiv();

        switch (roomState) {
            case ROOM_STATE_INTRO || ROOM_STATE_BEGINNER:
                // the comment marker on a line means its overwriting the defaults
                creepOptions = {
                    build: true,        //
                    upgrade: true,      //
                    repair: false,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: false,
                    getDroppedEnergy: true,     //
                    getFromLink: false,
                    getFromTerminal: false,
                };
                break;

            case ROOM_STATE_INTER:
                creepOptions = {
                    build: true,        //
                    upgrade: true,      //
                    repair: true,       //
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: true,     //
                    getDroppedEnergy: true,     //
                    getFromLink: false,
                    getFromTerminal: false,
                };
                break;

            case ROOM_STATE_ADVANCED:
                creepOptions = {
                    build: false,
                    upgrade: false,
                    repair: false,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: true,      //
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: true,       //
                    getFromContainer: true,     //
                    getDroppedEnergy: true,     //
                    getFromLink: false,
                    getFromTerminal: false,
                };
                break;

            case ROOM_STATE_UPGRADER || ROOM_STATE_STIMULATE:
                creepOptions = {
                    build: false,
                    upgrade: false,
                    repair: false,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: true,      //
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: true,       //
                    getFromContainer: true,     //
                    getDroppedEnergy: true,     //
                    getFromLink: false,
                    getFromTerminal: true,      //
                };
                break;

            case ROOM_STATE_SEIGE:
                creepOptions = {
                    build: false,
                    upgrade: false,
                    repair: false,
                    wallRepair: false,
                    fillTower: true,        //
                    fillStorage: true,      //
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: true,       //
                    getFromContainer: true,     //
                    getDroppedEnergy: false,
                    getFromLink: false,
                    getFromTerminal: false,
                };
                break;
        }

        return creepOptions;
    }

    /**
     * Generate body for worker creep
     * @param tier the tier of the room
     */
    public static generateWorkerBody(tier: TierConstant): BodyPartConstant[] | undefined {
        // Default Values for Worker
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1: // 1 Work, 2 Carry, 2 Move - Total Cost: 300
                body = { work: 1, carry: 2, move: 2 };
                break;

            case TIER_2: // 2 Work, 5 Carry, 3 Move - Total Cost: 550
                body = { work: 2, carry: 5, move: 3 };
                break;

            case TIER_3: // 4 Work, 4 Carry, 4 Move - Total Cost: 800
                body = { work: 4, carry: 4, move: 4 };
                break;

            case TIER_4: // 7 Work, 6 Carry, 6 Move - Total Cost: 1300
                body = { work: 7, carry: 6, move: 6 };
                break;

            case TIER_5 || TIER_6 || TIER_7 || TIER_8: // 10 Work, 8 Carry, 8 Move - Total Cost: 1800
                body = { work: 10, carry: 8, move: 8 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for worker creep
     * @param tier the tier of the room
     */
    public static generateWorkerOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {

        let creepOptions: CreepOptionsCiv = this.getDefaultCreepOptionsCiv();

        switch (roomState) {
            case ROOM_STATE_INTRO || ROOM_STATE_BEGINNER:
                // the comment marker on a line means its overwriting the defaults
                creepOptions = {
                    build: true,        //
                    upgrade: true,      //
                    repair: true,       //
                    wallRepair: true,   //
                    fillTower: true,    //
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: false,
                    getDroppedEnergy: true,     //
                    getFromLink: false,
                    getFromTerminal: false,
                };
                break;

            case ROOM_STATE_INTER:
                creepOptions = {
                    build: true,        //
                    upgrade: true,      //
                    repair: true,       //
                    wallRepair: true,   //
                    fillTower: true,    //
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: true,     //
                    getDroppedEnergy: true,     //
                    getFromLink: false,
                    getFromTerminal: false,
                };
                break;

            case ROOM_STATE_ADVANCED:
                creepOptions = {
                    build: true,        //
                    upgrade: true,      //
                    repair: true,       //
                    wallRepair: true,       //
                    fillTower: true,        //
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: true,       //
                    getFromContainer: true,     //
                    getDroppedEnergy: false,
                    getFromLink: false,
                    getFromTerminal: false,
                };
                break;

            case ROOM_STATE_UPGRADER || ROOM_STATE_STIMULATE:
                creepOptions = {
                    build: false,
                    upgrade: false,
                    repair: false,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: true,      //
                    fillContainer: false,
                    fillLink: true,         //
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: true,       //
                    getFromContainer: true,     //
                    getDroppedEnergy: true,     //
                    getFromLink: false,
                    getFromTerminal: true,      //
                };
                break;

            case ROOM_STATE_SEIGE:
                creepOptions = {
                    build: false,
                    upgrade: true,      //
                    repair: true,       //
                    wallRepair: true,       //
                    fillTower: true,        //
                    fillStorage: true,      //
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: true,       //
                    getFromContainer: true,     //
                    getDroppedEnergy: false,
                    getFromLink: false,
                    getFromTerminal: true,      //
                };
                break;
        }

        return creepOptions;
    }

    /**
     * Generate body for lorry creep
     * @param tier the tier of the room
     */
    public static generateLorryBody(tier: TierConstant): BodyPartConstant[] | undefined {
        // Default Values for Lorry
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        // There are currently no plans to use lorry before terminal becomes available
        switch (tier) {
            case TIER_1: // 3 Carry, 3 Move - Total Cost: 300
                body = { carry: 3, move: 3 };
                break;

            case TIER_2: // 6 Carry, 5 Move - Total Cost: 550
                body = { carry: 6, move: 5 };
                break;

            case TIER_3: // 8 Carry, 8 Move - Total Cost: 800
                body = { carry: 8, move: 8 };
                break;

            case TIER_4 || TIER_5: // 10 Carry, 10 Move - Total Cost: 1000
                body = { carry: 10, move: 10 };
                break;

            case TIER_6 || TIER_7 || TIER_8: // 20 Carry, 20 Move - Total Cost: 2000
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for lorry creep
     * @param tier the tier of the room
     */
    public static generateLorryOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {

        let creepOptions: CreepOptionsCiv = this.getDefaultCreepOptionsCiv();

        switch (roomState) {
            case ROOM_STATE_INTRO || ROOM_STATE_BEGINNER || ROOM_STATE_INTER
                || ROOM_STATE_ADVANCED || ROOM_STATE_UPGRADER || ROOM_STATE_STIMULATE
                || ROOM_STATE_SEIGE:
                // the comment marker on a line means its overwriting the defaults
                creepOptions = {
                    build: false,
                    upgrade: false,
                    repair: false,
                    wallRepair: false,
                    fillTower: true,        //
                    fillStorage: true,      //
                    fillContainer: true,    //
                    fillLink: true,         //
                    fillTerminal: true,     //
                    fillLab: true,          //
                    getFromStorage: true,       //
                    getFromContainer: true,     //
                    getDroppedEnergy: true,     //
                    getFromLink: true,          //
                    getFromTerminal: true,      //
                };
                break;
        }

        return creepOptions;
    }

    /**
     * Generate body for power upgrader creep
     * @param tier the tier of the room
     */
    public static generatePowerUpgraderBody(tier: TierConstant): BodyPartConstant[] | undefined {
        // Default Values for Power Upgrader
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        // There are currently no plans to use power upgraders before links become available
        // Need to experiment with work parts here and find out whats keeps up with the links
        // Without over draining the storage, but still puts up numbers
        switch (tier) {

            case TIER_6: // 15 Work, 1 Carry, 1 Move - Total Cost: 2300
                body = { work: 18, carry: 8, move: 4 };
                break;

            case TIER_7: // 1 Work, 8 Carry, 4 Move - Total Cost: 2800
                body = { work: 22, carry: 8, move: 4 };
                break;

            case TIER_8: // 1 Work, 8 Carry, 4 Move - Total Cost: 2100
                body = { work: 15, carry: 8, move: 4 }; // RCL 8 you can only do 15 per tick
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for power upgrader creep
     * @param tier the tier of the room
     */
    public static generatePowerUpgraderOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {

        let creepOptions: CreepOptionsCiv = this.getDefaultCreepOptionsCiv();

        // Fairly unique as well, they only upgrade
        switch (roomState) {

            case ROOM_STATE_UPGRADER || ROOM_STATE_STIMULATE || ROOM_STATE_SEIGE:
                creepOptions = {
                    build: false,
                    upgrade: true,      //
                    repair: false,
                    wallRepair: false,
                    fillTower: false,
                    fillStorage: false,
                    fillContainer: false,
                    fillLink: false,
                    fillTerminal: false,
                    fillLab: false,
                    getFromStorage: false,
                    getFromContainer: false,
                    getDroppedEnergy: false,
                    getFromLink: true,          //
                    getFromTerminal: false,
                };
                break;
        }

        return creepOptions;
    }
    // ------------


    // Remote -----
    // No need to start building these guys until tier 4, but allow them at tier 3 in case our strategy changes
    /**
     * Generate body for remote miner creep
     * @param tier the tier of the room
     */
    public static generateRemoteMinerBody(tier: TierConstant): BodyPartConstant[] | undefined {
        // Default Values for Remote Miner
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        // Cap the remote miner at 6 work parts (6 so they finish mining early and can build/repair their container)
        switch (tier) {

            case TIER_3: // 6 Work, 1 Carry, 3 Move - Total Cost: 800
                body = { work: 6, carry: 1, move: 3 };
                break;

            case TIER_4 || TIER_5 || TIER_6 || TIER_7 || TIER_8: // 6 Work, 1 Carry, 4 Move - Total Cost: 850
                body = { work: 6, carry: 1, move: 4 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for remote miner creep
     * @param tier the tier of the room
     */
    public static generateRemoteMinerOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {
        return undefined;
    }

    /**
     * Generate body for remote harvester creep
     * @param tier the tier of the room
     */
    public static generateRemoteHarvesterBody(tier: TierConstant): BodyPartConstant[] | undefined {
        // Default Values for Remote Harvester
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {

            case TIER_3:    // 8 Carry, 8 Move - Total Cost: 800
                body = { carry: 8, move: 8 }
                break;

            case TIER_4: // 10 Carry, 10 Move- Total Cost: 1000
                body = { carry: 10, move: 10 };
                break;

            case TIER_5: // 16 Carry, 16 Move - Total Cost: 1600
                body = { carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8: // 20 Carry, 20 Move - Total Cost: 2000
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for remote harvester creep
     * @param tier the tier of the room
     */
    public static generateRemoteHarvesterOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {
        return undefined;
    }

    /**
     * Generate body for remote reserver creep
     * @param tier the tier of the room
     */
    public static generateRemoteReserverBody(tier: TierConstant): BodyPartConstant[] | undefined {
        // Default Values for Remote Reserver
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };


        switch (tier) {

            case TIER_4 || TIER_5 || TIER_6 || TIER_7 || TIER_8: // 2 Reserve Carry, 2 Move - Total Cost: 800
                body = { reserve: 2, move: 2 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for remote reserver creep
     * @param tier the tier of the room
     */
    public static generateRemoteReserverOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {
        return undefined;
    }

    /**
     * Generate body for remote colonizer creep
     * @param tier the tier of the room
     */
    public static generateRemoteColonizerBody(tier: TierConstant): BodyPartConstant[] | undefined {
        // Default Values for Remote Colonizer
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {

            case TIER_4: // 7 Work, 5 Carry, 5 Move - Total Cost: 1300
                body = { work: 7, carry: 5, move: 6 };
                break;

            case TIER_5: // 9 Work, 8 Carry, 10 Move - Total Cost: 1800
                body = { work: 9, carry: 8, move: 10 };
                break;

            case TIER_6 || TIER_7 || TIER_8: // 12 Work, 10 Carry, 10 Move - Total Cost: 2300
                body = { work: 12, carry: 10, move: 12 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for remote colonizer creep
     * @param tier the tier of the room
     */
    public static generateRemoteColonizerOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {
        return undefined;
    }

    /**
     * Generate body for remote defender creep
     * @param tier the tier of the room
     */
    public static generateRemoteDefenderBody(tier: TierConstant): BodyPartConstant[] | undefined {
        // Default Values for Remote Defender
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {

            case TIER_3: // 5 Attack, 5 Move - Total Cost: 550
                body = { attack: 5, move: 5 };
                break;

            case TIER_4: //  6 Ranged Attack, 6 Move, - Total Cost: 1200
                body = { ranged_attack: 6, move: 6 };
                break;

            case TIER_5: // 8 Ranged Attack, 7 Move, 1 Heal - Total Cost: 1800
                body = { ranged_attack: 8, move: 7, heal: 1 };
                break;

            case TIER_6 || TIER_7 || TIER_8: // 8 Ranged Attack, 10 Move, 2 Heal
                body = { ranged_attack: 8, move: 10, heal: 2 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for remote defender creep
     * @param tier the tier of the room
     */
    public static generateRemoteDefenderOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {
        return undefined;
    }
    // ----------

    // Military -----
    /**
     * Generate body for zealot creep
     * @param tier the tier of the room
     */
    public static generateZealotBody(tier: TierConstant): BodyPartConstant[] | undefined {
        // Default Values for Zealot
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1: // 2 Attack, 2 Move - Total Cost: 260
                body = { attack: 2, move: 2 };
                break;

            case TIER_2: // 3 Attack, 3 Move  - Total Cost: 390
                body = { attack: 3, move: 3 };
                break;

            case TIER_3: // 5 Attack, 5 Move - Total Cost: 650
                body = { attack: 5, move: 5 };
                break;

            case TIER_4: // 10 Attack, 10 Move - Total Cost: 1300
                body = { attack: 2, move: 2 };
                break;

            case TIER_5: // 15 Attack, 12 Move - Total Cost: 1800
                body = { attack: 15, move: 12 };
                break;

            case TIER_6 || TIER_7 || TIER_8: // 20 Attack, 14 Move - Total Cost: 2300
                body = { attack: 20, move: 14 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for zealot creep
     * @param tier the tier of the room
     */
    public static generateZealotOptions(roomState: RoomStateConstant): CreepOptionsMili | undefined {
        return undefined;
    }

    /**
     * Generate body for medic creep
     * @param tier the tier of the room
     */
    public static generateMedicBody(tier: TierConstant): BodyPartConstant[] | undefined {
        // Default Values for Medic
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1: // 1 Heal, 1 Move - Total Cost: 300
                body = { heal: 1, move: 1 };
                break;

            case TIER_2: // 2 Heal, 1 Move - Total Cost: 550
                body = { heal: 2, move: 1 };
                break;

            case TIER_3: // 2 Heal, 2 Move - Total Cost: 600
                body = { heal: 2, move: 2 };
                break;

            case TIER_4: // 4 Heal, 4 Move - Total Cost: 1200
                body = { heal: 4, move: 4 };
                break;

            case TIER_5: // 6 Heal, 6 Move - Total Cost: 1800
                body = { heal: 6, move: 6 };
                break;

            case TIER_6 || TIER_7 || TIER_8: // 8 Heal, 6 Move - Total Cost: 2300
                body = { heal: 8, move: 6 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for medic creep
     * @param tier the tier of the room
     */
    public static generateMedicOptions(roomState: RoomStateConstant): CreepOptionsMili | undefined {
        return undefined;
    }

    /**
     * Generate body for stalker creep
     * @param tier the tier of the room
     */
    public static generateStalkerBody(tier: TierConstant): BodyPartConstant[] | undefined {
        // Default Values for Stalker
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1: // 1 Ranged Attack, 2 Move - Total Cost: 200
                body = { ranged_attack: 1, move: 1 };
                break;

            case TIER_2: // 3 Ranged Attack, 2 Move - Total Cost: 550
                body = { ranged_attack: 3, move: 2 };
                break;

            case TIER_3: // 4 Ranged Attack, 4 Move - Total Cost: 800
                body = { ranged_attack: 4, move: 4 };
                break;

            case TIER_4: // 6 Ranged Attack, 6 Move - Total Cost: 1200
                body = { ranged_attack: 6, move: 6 };
                break;

            case TIER_5: // 8 Ranged Attack, 8 Move - Total Cost: 1600
                body = { carranged_attackry: 8, move: 8 };
                break;

            case TIER_6 || TIER_7 || TIER_8: // 12 Ranged Attack, 10 Move - Total Cost: 2300
                body = { ranged_attack: 12, move: 10 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate options for stalker creep
     * @param tier the tier of the room
     */
    public static generateStalkerOptions(roomState: RoomStateConstant): CreepOptionsMili | undefined {
        return undefined;
    }
    // --------------

    /**
     * returns a set of creep options with all default values
     */
    public static getDefaultCreepOptionsCiv(): CreepOptionsCiv {

        return {
            build: false,
            upgrade: false,
            repair: false,
            wallRepair: false,
            fillTower: false,
            fillStorage: false,
            fillContainer: false,
            fillLink: false,
            fillTerminal: false,
            fillLab: false,
            getFromStorage: false,
            getFromContainer: false,
            getDroppedEnergy: false,
            getFromLink: false,
            getFromTerminal: false,
        };
    }

    /**
     * returns set of mili creep options with all default values
     */
    public static getDefaultCreepOptionsMili(): CreepOptionsMili {
        return {
            squadSize: 0,
            squadUUID: null,
            rallyLocation: null,
            seige: false,
            dismantler: false,
            healer: false,
            attacker: false,
            defender: false,
            flee: false
        };
    }
}
