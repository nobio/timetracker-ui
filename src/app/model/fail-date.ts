/**
 * Create a data base compliant object from Entry
 *  
 * @returns Entry Element from Mongo Database:
 * 
 * [
 *   {
 *     "error-date": "2014-01-29T00:00:00.000Z",
 *     "error-type": "INCOMPLETE"
 *   },
 *   {
 *     "error-date": "2014-04-27T23:00:00.000Z",
 *     "error-type": "WRONG_ORDER"
 *   }
 * ]
 * 
 */
export interface FailDate {
    type: string;  // INCOMPLETE or WRONG_ORDER
    date: Date;
    urlDate?: string;
}
