import { memRead_int32, memRead_ptr, memRead_string, memRead_uint32, memRead_uint8 } from "./mem-read.service";

export class GameSprite {
    public loaded: boolean = false;

    public id: number;

    public viewportX: number;

    public viewportY: number;

    public scrollX: number;

    public scrollY: number;

    public relativeX: number;

    public relativeY: number;

    public x: number;

    public y: number;

    public name: string;

    public resref: string;

    constructor(private procHandle: any, private basePtr: number) {
        this.init();
    }

    private init(): void {
        let type = memRead_uint8(this.procHandle, BigInt(this.basePtr + 0x8));
        
        if (type !== 49) {
            return;
        }

        this.basic();



        if (this.x < 0 || this.y < 0 || !this.name || !this.resref) {
            return;
        }

        this.loaded = true;
    }

    private basic(): void {
        this.id = memRead_uint32(this.procHandle, BigInt(this.basePtr + 0x48));
        // console.log('id ', this.id);

        this.x = memRead_uint32(this.procHandle, BigInt(this.basePtr + 0xC));
        this.y = memRead_uint32(this.procHandle, BigInt(this.basePtr + 0x10));
        // console.log('X: ', this.x, 'Y: ', this.y);

        let ptr = memRead_ptr(this.procHandle, BigInt(this.basePtr + 0x3928));
        this.name = memRead_string(this.procHandle, BigInt(ptr));

        if (this.name !== 'Xan fan') {
            return;
        }
        // console.log('Name: ', this.name);

        this.resref = memRead_string(this.procHandle, BigInt(this.basePtr + 0x540)).replaceAll('*', '');
        // console.log('resref: ', this.resref);

        const gameAreaPtr = memRead_ptr(this.procHandle, BigInt(this.basePtr + 0x18));
        this.viewportX = memRead_int32(this.procHandle, BigInt(gameAreaPtr + 0x5C8 + 0x78 + 0x8))
        this.viewportY = memRead_int32(this.procHandle, BigInt(gameAreaPtr + 0x5C8 + 0x78 + 0x8 + 0x4))
        console.log('viewport: ', this.viewportX, this.viewportY)
        this.scrollX = memRead_int32(this.procHandle, BigInt(gameAreaPtr + 0x5C8 + 0xC0))
        if (this.scrollX > 10000) {
            this.scrollX = 0;
        }
        this.scrollY = memRead_int32(this.procHandle, BigInt(gameAreaPtr + 0x5C8 + 0xC0 + 0x4))
        if (this.scrollY > 10000) {
            this.scrollY = 0;
        }
        console.log('scroll: ', this.scrollX, this.scrollY);        
        this.relativeX = this.x - this.scrollX;
        this.relativeY = this.y - this.scrollY;
        console.log('relative', this.relativeX, this.relativeY);
    }
}