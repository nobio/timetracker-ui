export class User {
    id: string;
    name: string;
    mailAddress: string;
    password: string;

    constructor(id: string = '', name: string = '', mailAddress: string = '', password: string = '') {
        this.id = id;
        this.name = name;
        this.mailAddress = mailAddress;
        this.password = password;
    }
}