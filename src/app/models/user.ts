export class User {
    id: string;
    name: string;
    username: string;
    mailAddress: string;
    password: string;

    constructor(id: string = '', name: string = '', username = '', mailAddress: string = '', password: string = '') {
        this.id = id;
        this.name = name;
        this.username = username;
        this.mailAddress = mailAddress;
        this.password = password;
    }
}