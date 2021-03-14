import { LogService } from "../service/log.service";
import { Toggle } from "./toggle";

export class Toggles {
    createEntry: Toggle;
    deleteEntry: Toggle;
    backupDB: Toggle;
    dumpFS: Toggle;
    recalculate: Toggle;
    serverStartUp: Toggle;
    evaluateData: Toggle;

    constructor() {
        this.createEntry = new Toggle();
        this.deleteEntry = new Toggle();
        this.backupDB = new Toggle();
        this.dumpFS = new Toggle();
        this.recalculate = new Toggle();
        this.serverStartUp = new Toggle();
        this.evaluateData = new Toggle();
    }


    getToggle(toggleName: string): Toggle {
        if (toggleName == 'CREATE_ENTRY') {
            return this.createEntry;
        } else if (toggleName == 'DELETE_ENTRY') {
            return this.deleteEntry;
        } else if (toggleName == 'BACKUP_DB') {
            return this.backupDB;
        } else if (toggleName == 'DUMP_FS') {
            return this.dumpFS;
        } else if (toggleName == 'RECALCULATE') {
            return this.recalculate;
        } else if (toggleName == 'SERVER_STARTED') {
            return this.serverStartUp;
        } else if (toggleName == 'EVALUATE_DATA') {
            return this.evaluateData;
        } else {
            return new Toggle();
        }
    }

    setToggle(toggle) {
        let t: Toggle = new Toggle();
        t.setData(toggle._id, toggle.name, toggle.toggle, toggle.notification);

        if (toggle.name == 'CREATE_ENTRY') {
            this.createEntry = t;
        } else if (toggle.name == 'DELETE_ENTRY') {
            this.deleteEntry = t;
        } else if (toggle.name == 'BACKUP_DB') {
            this.backupDB = t;
        } else if (toggle.name == 'DUMP_FS') {
            this.dumpFS = t;
        } else if (toggle.name == 'RECALCULATE') {
            this.recalculate = t;
        } else if (toggle.name == 'SERVER_STARTED') {
            this.serverStartUp = t;
        } else if (toggle.name == 'EVALUATE_DATA') {
            this.evaluateData = t;
        }
    }

}
