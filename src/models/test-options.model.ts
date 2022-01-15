export class E_TestOptions {
    public showPron: boolean = false;       // show Pronunciation
    public showDesc: boolean = false;       // show Description
    public order: boolean = true;           // true => Word (disabled) -> Translation (input)
    private _rowSize: number = 10;          // size of correct inputs in one row
    public selectedCollIds: string[] = [];  // ids of collections which will *NOT* tested

    constructor() {}

    /*******************
     * GETTER & SETTER *
     *******************/
    set rowSize(value: number) {
        if (value > 0 && value < 20) {
            this._rowSize = value;
        }
    }
    get rowSize(): number {
        return this._rowSize;
    }

    /*******************/
    public static createObject(data: any): E_TestOptions {
        let object: E_TestOptions = data;
        object.rowSize = data._rowSize;
        return object;
    }
}