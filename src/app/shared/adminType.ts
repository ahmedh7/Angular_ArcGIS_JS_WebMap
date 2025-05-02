export class AdminType {
    id: string;
    name: string;
    parentId: string;
    selected: boolean = false;

    constructor(id: string, name: string, parentId: string){
        this.id = id;
        this.name = name;
        this.parentId = parentId;
    }
}