import { memRead_int16, memRead_int32, memRead_ptr, memRead_string, memRead_uint32, memRead_uint8 } from "./mem-read.service";
import * as _ from 'lodash-es'

export class GameSprite {
    public loaded: boolean = false;

    public type: number;

    public canBeSeen: number;

    public id: number;

    private gameAreaPtr: number;

    public hp: number;

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
        this.type = memRead_uint8(this.procHandle, BigInt(this.basePtr + 0x8));

        this.gameAreaPtr = memRead_ptr(this.procHandle, BigInt(this.basePtr + 0x18));

        this.hp = memRead_int16(this.procHandle, BigInt(this.basePtr + 0x560 + 0x1C));

        this.canBeSeen = memRead_int16(this.procHandle, BigInt(this.basePtr + 0x4C));
        this.resref = memRead_string(this.procHandle, BigInt(this.basePtr + 0x540)).replaceAll('*', '');

        this.basic();
        
        this.loaded = !this.invalid;
    }


    private get invalid(): boolean {
        return this.type !== 0x31 || !this.hp || !this.gameAreaPtr || this.x < 0 || this.y < 0 || !this.name || !this.resref || !this.canBeSeen
    }

    private basic(): void {
        this.id = memRead_uint32(this.procHandle, BigInt(this.basePtr + 0x48));
        // console.log('id ', this.id);

        this.x = memRead_uint32(this.procHandle, BigInt(this.basePtr + 0xC));
        this.y = memRead_uint32(this.procHandle, BigInt(this.basePtr + 0x10));
        // console.log('X: ', this.x, 'Y: ', this.y);

        let ptr = memRead_ptr(this.procHandle, BigInt(this.basePtr + 0x3928));
        this.name = memRead_string(this.procHandle, BigInt(ptr));

        
        
        this.viewportX = memRead_int32(this.procHandle, BigInt(this.gameAreaPtr + 0x5C8 + 0x78 + 0x8))
        this.viewportY = memRead_int32(this.procHandle, BigInt(this.gameAreaPtr + 0x5C8 + 0x78 + 0x8 + 0x4))
        // console.log('viewport: ', this.viewportX, this.viewportY)
        this.scrollX = memRead_int32(this.procHandle, BigInt(this.gameAreaPtr + 0x5C8 + 0xC0))
        this.scrollY = memRead_int32(this.procHandle, BigInt(this.gameAreaPtr + 0x5C8 + 0xC0 + 0x4))
        // console.log('scroll: ', this.scrollX, this.scrollY);        
        this.relativeX = this.x - this.scrollX;
        this.relativeY = this.y - this.scrollY;
        // console.log('relative', this.relativeX, this.relativeY);
    }
}