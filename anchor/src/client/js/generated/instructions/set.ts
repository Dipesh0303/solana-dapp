/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  combineCodec,
  fixDecoderSize,
  fixEncoderSize,
  getBytesDecoder,
  getBytesEncoder,
  getStructDecoder,
  getStructEncoder,
  getU8Decoder,
  getU8Encoder,
  transformEncoder,
  type Address,
  type Codec,
  type Decoder,
  type Encoder,
  type IAccountMeta,
  type IInstruction,
  type IInstructionWithAccounts,
  type IInstructionWithData,
  type ReadonlyUint8Array,
  type WritableAccount,
} from 'gill';
import { TEST1_PROGRAM_ADDRESS } from '../programs';
import { getAccountMetaFactory, type ResolvedAccount } from '../shared';

export const SET_DISCRIMINATOR = new Uint8Array([
  198, 51, 53, 241, 116, 29, 126, 194,
]);

export function getSetDiscriminatorBytes() {
  return fixEncoderSize(getBytesEncoder(), 8).encode(SET_DISCRIMINATOR);
}

export type SetInstruction<
  TProgram extends string = typeof TEST1_PROGRAM_ADDRESS,
  TAccountTest1 extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends readonly IAccountMeta<string>[] = [],
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountTest1 extends string
        ? WritableAccount<TAccountTest1>
        : TAccountTest1,
      ...TRemainingAccounts,
    ]
  >;

export type SetInstructionData = {
  discriminator: ReadonlyUint8Array;
  value: number;
};

export type SetInstructionDataArgs = { value: number };

export function getSetInstructionDataEncoder(): Encoder<SetInstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([
      ['discriminator', fixEncoderSize(getBytesEncoder(), 8)],
      ['value', getU8Encoder()],
    ]),
    (value) => ({ ...value, discriminator: SET_DISCRIMINATOR })
  );
}

export function getSetInstructionDataDecoder(): Decoder<SetInstructionData> {
  return getStructDecoder([
    ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
    ['value', getU8Decoder()],
  ]);
}

export function getSetInstructionDataCodec(): Codec<
  SetInstructionDataArgs,
  SetInstructionData
> {
  return combineCodec(
    getSetInstructionDataEncoder(),
    getSetInstructionDataDecoder()
  );
}

export type SetInput<TAccountTest1 extends string = string> = {
  test_1: Address<TAccountTest1>;
  value: SetInstructionDataArgs['value'];
};

export function getSetInstruction<
  TAccountTest1 extends string,
  TProgramAddress extends Address = typeof TEST1_PROGRAM_ADDRESS,
>(
  input: SetInput<TAccountTest1>,
  config?: { programAddress?: TProgramAddress }
): SetInstruction<TProgramAddress, TAccountTest1> {
  // Program address.
  const programAddress = config?.programAddress ?? TEST1_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    test_1: { value: input.test_1 ?? null, isWritable: true },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  // Original args.
  const args = { ...input };

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [getAccountMeta(accounts.test_1)],
    programAddress,
    data: getSetInstructionDataEncoder().encode(args as SetInstructionDataArgs),
  } as SetInstruction<TProgramAddress, TAccountTest1>;

  return instruction;
}

export type ParsedSetInstruction<
  TProgram extends string = typeof TEST1_PROGRAM_ADDRESS,
  TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[],
> = {
  programAddress: Address<TProgram>;
  accounts: {
    test_1: TAccountMetas[0];
  };
  data: SetInstructionData;
};

export function parseSetInstruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[],
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedSetInstruction<TProgram, TAccountMetas> {
  if (instruction.accounts.length < 1) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts![accountIndex]!;
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      test_1: getNextAccount(),
    },
    data: getSetInstructionDataDecoder().decode(instruction.data),
  };
}
