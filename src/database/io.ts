export class BinaryReader{
    b: Buffer;
    i: number = 0;

    /**
     * read all numbers with LE
     */
    constructor(buffer: Buffer){
        this.b = buffer;
    }

    private read(length: number): number{
        let n = this.b.readIntLE(this.i, length);
        this.i += length;
        return n;
    }

    private readBytes(length: number): Buffer{
        let buf = this.b.slice(this.i, length);
        this.i += length;
        return buf;
    }

    //#region read

    readByte(): number{
        return this.b[this.i++];
    }

    readBool(): boolean{
        return !!this.b[this.i++];
    }

    readInt(): number{
        return this.read(4);
    }

    readLongLong(): bigint{
        let n = this.b.readBigInt64LE(this.i);
        this.i += 8;
        return n;
    }

    readStr(): string{
        // read out an int32 7 bit at a time
        // the high bit of the byte, when on,
        // means to continue reading more bytes
        let b = this.readByte();
        let length = b & 0x7f;
        let shift = 0;
        while(b & 0x80){
            b = this.readByte();
            shift += 7;
            length |= (b & 0x7f) << shift;
        }
        return this.readBytes(length).toString('utf8');
    }

    //#endregion read
}
