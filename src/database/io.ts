export class BinaryReader{
    buffer: Buffer;
    index: number = 0;

    /**
     * read all numbers with LE
     */
    constructor(buffer: Buffer){
        this.buffer = buffer;
    }

    private read(length: number): number{
        let n = this.buffer.readIntLE(this.index, length);
        this.index += length;
        return n;
    }

    private bytes(length: number): Buffer{
        let buf = this.buffer.slice(this.index, length);
        this.index += length;
        return buf;
    }

    //#region read

    byte(): number{
        return this.buffer[this.index++];
    }

    bool(): boolean{
        return !!this.buffer[this.index++];
    }

    int(): number{
        return this.read(4);
    }

    str(): string{
        // read out an int32 7 bit at a time
        // the high bit of the byte, when on,
        // means to continue reading more bytes
        let b = this.byte();
        let length = b & 0x7f;
        let shift = 0;
        while(b & 0x80){
            b = this.byte();
            shift += 7;
            length |= (b & 0x7f) << shift;
        }
        return this.bytes(length).toString('utf8');
    }

    //#endregion read
}
