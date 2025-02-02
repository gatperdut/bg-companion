import { memRead_int32, memRead_ptr, memRead_string, memRead_uint32, memRead_uint8 } from "./mem-read.service";

export class GameSprite {
    public loaded: boolean = false;

    public id: number;

    public x: number;

    public y: number;

    public name: string;

    public resref: string;

    constructor(procHandle: any, basePtr: number) {
        this.init(procHandle, basePtr);
    }

    private init(procHandle: any, basePtr: number): void {
        let type = memRead_uint8(procHandle, BigInt(basePtr + 0x8));
        
        if (type !== 49) {
            return;
        }

        this.id = memRead_uint32(procHandle, BigInt(basePtr + 0x48));
        // console.log('id ', this.id);

        this.x = memRead_uint32(procHandle, BigInt(basePtr + 0xC));
        this.y = memRead_uint32(procHandle, BigInt(basePtr + 0x10));
        // console.log('X: ', this.x, 'Y: ', this.y);

        let ptr = memRead_ptr(procHandle, BigInt(basePtr + 0x3928));
        this.name = memRead_string(procHandle, BigInt(ptr));
        // console.log('Name: ', this.name);

        this.resref = memRead_string(procHandle, BigInt(basePtr + 0x540)).replaceAll('*', '');
        // console.log('resref: ', this.resref);

        const gameAreaPtr = memRead_ptr(procHandle, BigInt(basePtr + 0x18));
        let viewportX = memRead_int32(procHandle, BigInt(gameAreaPtr + 0x5C8 + 0x78 + 0x8))
        let viewportY = memRead_int32(procHandle, BigInt(gameAreaPtr + 0x5C8 + 0x78 + 0x8 + 0x4))
        // console.log('viewport: ', viewportX, viewportY)
        let scrollX = memRead_int32(procHandle, BigInt(gameAreaPtr + 0x5C8 + 0xC0))
        let scrollY = memRead_int32(procHandle, BigInt(gameAreaPtr + 0x5C8 + 0xC0 + 0x4))
        let relativeX = this.x - scrollX;
        let relativeY = this.y - scrollY;
        // console.log('relative', relativeX, relativeY);



        if (this.x < 0 || this.y < 0 || !this.name || !this.resref) {
            console.log('Invalid cGameobject.');

            return;
        }

        this.loaded = true;
    }
}