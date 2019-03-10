import RoomApi from "Api/Room.Api";
import { LINK_MINIMUM_ENERGY, CONTAINER_MINIMUM_ENERGY } from "utils/config";
import MemoryApi from "Api/Memory.Api";

export default class GetEnergyJobs {
    /**
     * Gets a list of GetEnergyJobs for the sources of a room
     * @param room The room to create the job list for
     */
    public static createSourceJobs(room: Room): GetEnergyJob[] {
        // List of all sources that are under optimal work capacity
        const openSources = RoomApi.getOpenSources(room);

        if (openSources.length === 0) {
            return [];
        }

        const sourceJobList: GetEnergyJob[] = [];

        _.forEach(openSources, (source: Source) => {
            // Create the StoreDefinition for the source
            const sourceResources: StoreDefinition = { energy: source.energy };
            // Create the GetEnergyJob object for the source
            const sourceJob: GetEnergyJob = {
                targetID: source.id,
                targetType: "source",
                resources: sourceResources,
                isTaken: false
            };
            // Append the GetEnergyJob to the main array
            sourceJobList.push(sourceJob);
        });

        return sourceJobList;
    }

    /**
     * Gets a list of GetEnergyJobs for the containers of a room
     * @param room The room to create the job list for
     */
    public static createContainerJobs(room: Room): GetEnergyJob[] {
        // List of all containers with >= CONTAINER_MINIMUM_ENERGY (from config.ts)
        const containers = MemoryApi.getStructureOfType(
            room,
            STRUCTURE_CONTAINER,
            (container: StructureContainer) => container.store.energy > CONTAINER_MINIMUM_ENERGY
        );

        if (containers.length === 0) {
            return [];
        }

        const containerJobList: GetEnergyJob[] = [];

        _.forEach(containers, (container: StructureContainer) => {
            const containerJob: GetEnergyJob = {
                targetID: container.id,
                targetType: STRUCTURE_CONTAINER,
                resources: container.store,
                isTaken: false
            };
            // Append to the main array
            containerJobList.push(containerJob);
        });

        return containerJobList;
    }

    /**
     * Gets a list of GetEnergyJobs for the links of a room
     * @param room The room to create the job list for
     */
    public static createLinkJobs(room: Room): GetEnergyJob[] {
        // List of all the links in the room with > LINK_MINIMUM_ENERGY (from config.ts)
        // AND no active cooldown
        const activeLinks = MemoryApi.getStructureOfType(room, STRUCTURE_LINK, (link: StructureLink) => {
            return link.energy > LINK_MINIMUM_ENERGY && link.cooldown === 0;
        });

        if (activeLinks.length === 0) {
            return [];
        }

        const linkJobList: GetEnergyJob[] = [];

        _.forEach(activeLinks, (link: StructureLink) => {
            // Create the StoreDefinition for the link
            const linkStore: StoreDefinition = { energy: link.energy };

            const linkJob: GetEnergyJob = {
                targetID: link.id,
                targetType: STRUCTURE_LINK,
                resources: linkStore,
                isTaken: false
            };

            linkJobList.push(linkJob);
        });

        return linkJobList;
    }

    /**
     * Gets a list of GetEnergyJobs for the backup structures of a room (terminal, storage)
     * @param room  The room to create the job list for
     */
    public static createBackupStructuresJobs(room: Room): GetEnergyJob[] {
        const backupJobList: GetEnergyJob[] = [];

        // Create the storage job if active
        if (room.storage !== undefined) {
            const storageJob: GetEnergyJob = {
                targetID: room.storage.id,
                targetType: STRUCTURE_STORAGE,
                resources: room.storage.store,
                isTaken: false
            };

            backupJobList.push(storageJob);
        }
        // Create the terminal job if active
        if (room.terminal !== undefined) {
            const terminalJob: GetEnergyJob = {
                targetID: room.terminal.id,
                targetType: STRUCTURE_TERMINAL,
                resources: room.terminal.store,
                isTaken: false
            };

            backupJobList.push(terminalJob);
        }

        return backupJobList;
    }
}
