import * as borsh from 'borsh';
import * as BufferLayout from '@solana/buffer-layout';

export class Operation {
  public static readonly Add = 0;
  public static readonly Subtract = 1;
  public static readonly Multiply = 2;
  public static readonly Divide = 3;
  public static readonly Modulo = 4;
}

export class ExpressionCalculator {
  a: number = 0;
  b: number = 0;
  op: object = { Add: {} };
  constructor(fields: { a: number, b: number, op: object } | undefined = undefined) {
    if (fields !== undefined) {
      this.a = fields.a;
      this.b = fields.b;
      this.op = fields.op;
    }
  }

  static create(a: number, b: number, op: Operation): Buffer {
    const bufferLayout: BufferLayout.Structure<any> = BufferLayout.struct([
      BufferLayout.f64('a'),
      BufferLayout.f64('b'),
      BufferLayout.u8('op')
    ]);

    const buffer = Buffer.alloc(bufferLayout.span);
    bufferLayout.encode({
      a,
      b,
      op
    }, buffer);

    return buffer;
  }
}

const AddEnumType = {
  struct: {
    Add: { struct: {} }
  }
}

const SubtractEnumType = {
  struct: {
    Subtract: { struct: {} }
  }
}

const MultiplyEnumType = {
  struct: {
    Multiply: { struct: {} }
  }
}

const DivideEnumType = {
  struct: {
    Divide: { struct: {} }
  }
}

const ModuloEnumType = {
  struct: {
    Modulo: { struct: {} }
  }
}

const ExpressionCalculatorSchema = {
  struct: {
    a: 'f64',
    b: 'f64',
    op: {
      enum: [
        AddEnumType,
        SubtractEnumType,
        MultiplyEnumType,
        DivideEnumType,
        ModuloEnumType
      ]
    }
  }
}

export const EXPRESSION_CALCULATOR_SIZE = borsh.serialize(ExpressionCalculatorSchema, new ExpressionCalculator()).length;