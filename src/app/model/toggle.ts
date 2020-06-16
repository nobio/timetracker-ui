export class Toggle {
    id: string;
    name: string;
    toggle: boolean;
    notification: string;

    setData(id: string, name: string, toggle: boolean, notification: string) {
        this.id = id;
        this.name = name;
        this.toggle = toggle;
        this.notification = notification;
    }
}
