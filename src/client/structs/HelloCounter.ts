import * as borsh from 'borsh';

class HelloCounter {
  counter = 0;
  constructor(fields: { counter: number } | undefined = undefined) {
    if (fields !== undefined) {
      this.counter = fields.counter;
    }
  }
}

const HelloCounterSchema = {
  struct: {
    counter: 'u64'
  }
}

export const HELLO_COUNTER_SIZE = borsh.serialize(HelloCounterSchema, new HelloCounter()).length;