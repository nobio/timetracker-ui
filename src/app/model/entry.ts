import moment from 'moment';

export class Entry {
    public id: string;
    public direction: string;
    public longitude: number;
    public latitude: number;
    public lastChanged: string;
    public entryDate: string;

    direction_translated: string;
    ion_direction_icon: string;
    ion_color: string;

    /** getter for a localized time */
    public get localEntryDate(): string {
        // this.logger.log('get localDate from orig date: ' + this.entryDate);
        if (this.entryDate) {
            return moment(this.entryDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        } else {
            return undefined;
        }
    }
    public set localEntryDate(dt: string) {
        // this.logger.log('set localDate: ' + dt);
        this.entryDate = moment(dt).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    }


    /**
   * Rework, enrich, filter, etc. the database entries
   *  
   * @param element Entry Element from Mongo Database:
   * 
   *   {
   *    "direction": "enter",
   *    "_id": "530eeb1ea8ee5e0000000917",
   *    "__v": 0,
   *    "last_changed": "2014-02-27T07:37:02.543Z",
   *    "entry_date": "2014-02-27T07:37:00.000Z"
   *   }
   */
    public encodeEntry(element: any) {

        this.id = element._id;
        this.direction = element.direction;
        this.lastChanged = element.last_changed;
        this.entryDate = element.entry_date;
        this.longitude = element.longitude;
        this.latitude = element.latitude

        if (this.direction == 'enter') {
            this.ion_direction_icon = 'enter';
            this.ion_color = 'primary'
            this.direction_translated = 'kommen';
        } else if (this.direction == 'go') {
            this.ion_direction_icon = 'exit';
            this.ion_color = 'secondary'
            this.direction_translated = 'gehen';
        }

        return this;
    }

    /**
     * Create a data base compliant object from Entry
     *  
     * @returns Entry Element from Mongo Database:
     * 
     *   {
     *    "direction": "enter",
     *    "_id": "530eeb1ea8ee5e0000000917",
     *    "__v": 0,
     *    "last_changed": "2014-02-27T07:37:02.543Z",
     *    "entry_date": "2014-02-27T07:37:00.000Z"
     *   }
     */
    public decodeEntry(): any {
        var e = {} as any;

        e._id = this.id;
        e.last_changed = this.lastChanged;
        e.entry_date = this.entryDate;
        e.longitude = this.longitude;
        e.latitude = this.latitude;
        e.direction = this.direction;

        return e;
    }

}
