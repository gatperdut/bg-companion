import { HANDLE_PTR_TYPE } from './koffi/defs/handles';
import { memReadNumber, memReadString } from './koffi/memread';

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

  constructor(
    private procHandle: HANDLE_PTR_TYPE,
    private basePtr: number
  ) {
    this.init();
  }

  private init(): void {
    this.type = memReadNumber(this.procHandle, BigInt(this.basePtr + 0x8), 'UINT8');

    this.gameAreaPtr = memReadNumber(this.procHandle, BigInt(this.basePtr + 0x18), 'PTR');

    this.hp = memReadNumber(this.procHandle, BigInt(this.basePtr + 0x560 + 0x1c), 'INT16');

    this.canBeSeen = memReadNumber(this.procHandle, BigInt(this.basePtr + 0x4c), 'INT16');
    this.resref = memReadString(this.procHandle, BigInt(this.basePtr + 0x540)).replaceAll('*', '');

    this.basic();

    this.loaded = !this.invalid;
  }

  private get invalid(): boolean {
    return (
      this.type !== 0x31 ||
      !this.hp ||
      !this.gameAreaPtr ||
      this.x < 0 ||
      this.y < 0 ||
      !this.name ||
      !this.resref ||
      !this.canBeSeen
    );
  }

  private basic(): void {
    this.id = memReadNumber(this.procHandle, BigInt(this.basePtr + 0x48), 'UINT32');
    // console.log('id ', this.id);

    this.x = memReadNumber(this.procHandle, BigInt(this.basePtr + 0xc), 'UINT32');
    this.y = memReadNumber(this.procHandle, BigInt(this.basePtr + 0x10), 'UINT32');
    // console.log('X: ', this.x, 'Y: ', this.y);

    const ptr = memReadNumber(this.procHandle, BigInt(this.basePtr + 0x3928), 'PTR');
    this.name = memReadString(this.procHandle, BigInt(ptr));

    this.viewportX = memReadNumber(
      this.procHandle,
      BigInt(this.gameAreaPtr + 0x5c8 + 0x78 + 0x8),
      'INT32'
    );
    this.viewportY = memReadNumber(
      this.procHandle,
      BigInt(this.gameAreaPtr + 0x5c8 + 0x78 + 0x8 + 0x4),
      'INT32'
    );
    // console.log('viewport: ', this.viewportX, this.viewportY)
    this.scrollX = memReadNumber(this.procHandle, BigInt(this.gameAreaPtr + 0x5c8 + 0xc0), 'INT32');
    this.scrollY = memReadNumber(
      this.procHandle,
      BigInt(this.gameAreaPtr + 0x5c8 + 0xc0 + 0x4),
      'INT32'
    );
    // console.log('scroll: ', this.scrollX, this.scrollY);
    this.relativeX = this.x - this.scrollX;
    this.relativeY = this.y - this.scrollY;
    // console.log('relative', this.relativeX, this.relativeY);
  }
}
