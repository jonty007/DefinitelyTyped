/// <reference types="node" />
import { Transaction as bTransaction, Psbt, TxInput, TxOutput } from '@bitcoin-computer/nakamotojs';

type Json = JBasic | JObject | JArray;
type JBasic = undefined | null | boolean | number | string | symbol | bigint;
type JArray = Json[];
interface JObject {
    [x: string]: Json;
}
type SJson = JBasic | SJObject | SJArray;
type SJArray = SJson[];
interface SJObject {
    [x: string]: SJson;
    _id: string;
    _rev: string;
    _root: string;
    _owners: string[];
    _amount: number;
    _readers?: string[];
    _url?: string;
}

declare class Mock {
    _id: string;
    _rev: string;
    _root: string;
    _amount: number;
    _owners: string[];
    constructor({
        _id,
        _rev,
        _root,
    }?: {
        _id?: string | undefined;
        _rev?: string | undefined;
        _root?: string | undefined;
    });
}

declare class Transaction {
    tx: bTransaction;
    outData: Data[];
    constructor(tx?: bTransaction);
    get txId(): string;
    get inputs(): string[];
    get encoding(): {
        ioDescriptor: number[];
        dataPrefix: string;
        ioMap: number[];
    };
    get ioDescriptor(): number[];
    get ioMap(): number[];
    get dataPrefix(): string;
    get inputsLength(): number;
    get outputsLength(): number;
    get maxDataIndex(): number;
    get ownerInputs(): TxInput[];
    get ownerOutputs(): TxOutput[];
    get inRevs(): string[];
    get outRevs(): string[];
    get zip(): string[][];
    isBcTx(chain: Chain, network: Network): boolean;
    getOwnerOutputs(): TxOutput[];
    getDataOutputs(): TxOutput[];
    getOutData(restClient: RestClient): Promise<Data[]>;
    getOwners(): string[][];
    getAmounts(): number[];
    spendFromData(inputRevs: string[]): void;
    inputIndexesToRevs(env: {
        [s: string]: number;
    }): {
        [s: string]: string;
    };
    revsToInputIndexes(env: {
        [s: string]: string;
    }): {
        [s: string]: number;
    };
    createDataOuts(objects: Partial<ProgramMetaData>[], wallet: Wallet, ioMap?: number[]): void;
    static fromTransaction(tx: bTransaction, restClient?: RestClient): Promise<Transaction>;
    static fromTxHex({ hex, restClient }: {
        hex?: string | undefined;
        restClient?: RestClient | undefined;
    }): Promise<Transaction>;
    static fromTxId({ txId, restClient, }: {
        txId?: string | undefined;
        restClient?: RestClient | undefined;
    }): Promise<Transaction>;
    static getUtxosFromTx(tx: bTransaction): string[];
}

declare class Wallet {
    readonly restClient: RestClient;
    constructor(params?: ComputerOptions);
    derive(subpath?: string): Wallet;
    getBalance(): Promise<number>;
    getUtxos(): Promise<_Unspent[]>;
    getDustThreshold(isWitnessProgram: boolean, script?: Buffer): number;
    getAmountThreshold(isWitnessProgram: boolean, script: Buffer): number;
    getUtxosWithOpts({ include, exclude }?: FundOptions): Promise<_Unspent[]>;
    fetchUtxo: (utxo: _Unspent) => Promise<Utxo>;
    checkFee(fee: number, size: number): void;
    getSigOpCount(script: Buffer): number;
    getLegacySigOpCount(tx: bTransaction): Promise<number>;
    getTransactionSigOpCost(tx: bTransaction): Promise<number>;
    getTxSize(txSize: any, nSigOpCost: any, bytesPerSigOp: any): number;
    estimatePsbtSize(tx: Psbt): number;
    fundPsbt(tx: Psbt, opts?: FundOptions): Promise<void>;
    getOutputSpent: (input: TxInput) => Promise<TxOutput>;
    getInputAmount: (tx: bTransaction) => Promise<number>;
    getOutputAmount: (tx: bTransaction) => number;
    estimateSize(tx: any): Promise<number>;
    estimateFee(tx: any): Promise<number>;
    fund(tx: bTransaction, opts?: FundOptions): Promise<void>;
    sign(transaction: bTransaction, { inputIndex, sighashType, inputScript }?: SigOptions): Promise<void>;
    broadcast(tx: bTransaction): Promise<string>;
    send(satoshis: number, address: string): Promise<string>;
    get hdPrivateKey(): any;
    get privateKey(): Buffer;
    get publicKey(): Buffer;
    get passphrase(): string;
    get path(): string;
    get chain(): Chain;
    get network(): Network;
    get url(): string;
    get mnemonic(): string;
    get address(): string;
}

declare class UrlFetch {
    baseUrl: string;
    privateKey?: Buffer;
    keyPair: any;
    constructor(baseUrl?: string, keyPair?: any);
    _get<T>(route: string): Promise<T>;
    _post<T1, T2>(route: string, data: T1): Promise<T2>;
    _delete<T>(route: string): Promise<T>;
    retry: (error: any) => boolean;
    get<T>(route: string): Promise<T>;
    post<T1, T2>(route: string, datum: T1): Promise<T2>;
    delete<T>(route: string): Promise<T>;
}

declare class RestClient {
    readonly chain: Chain;
    readonly network: Network;
    readonly networkObj: any;
    readonly mnemonic: string;
    readonly path: string;
    readonly passphrase: string;
    readonly bcn: UrlFetch;
    readonly dustRelayTxFee: number;
    readonly _keyPair: any;
    satPerByte: number;
    private randomAddress;
    constructor({ chain, network, mnemonic, path, passphrase, url, satPerByte, dustRelayFee }?: ComputerOptions);
    get privateKey(): Buffer;
    get keyPair(): any;
    getBalance(address: string): Promise<number>;
    getTransactions(txIds: string[]): Promise<_Transaction[]>;
    getRawTxs(txIds: string[]): Promise<string[]>;
    get RANDOM_ADDRESS(): string;
    getUtxosByAddress(address: string): Promise<_Unspent[]>;
    query({ publicKey, hash, limit, offset, order, ids, mod }: Partial<Query>): Promise<string[]>;
    idsToRevs(outIds: string[]): Promise<string[]>;
    revToId(rev: string): Promise<string>;
    rpc(method: string, params: string): Promise<any>;
    static getSecretOutput({ _url, keyPair }: { _url: string; keyPair: any }): Promise<{
        host: string;
        data: string;
    }>;
    static setSecretOutput({
        secretOutput,
        host,
        keyPair,
    }: {
        secretOutput: SecretOutput;
        host: string;
        keyPair: any;
    }): Promise<Data & (Encrypted | Stored)>;
    static deleteSecretOutput({ _url, keyPair }: { _url: string; keyPair: any }): Promise<void>;
    get url(): string;
    broadcast(txHex: string): Promise<string>;
    fetch(txId: string): Promise<_Transaction>;
    fetchAll(txIds: string[]): Promise<_Transaction[]>;
    unspents(address: string): Promise<_Unspent[]>;
    faucet(address: string, value: number): Promise<_Unspent>;
    faucetComplex(output: Buffer, value: number): Promise<_Unspent>;
    verify(txo: _Unspent): Promise<void>;
    mine(count: number): Promise<void>;
    height(): Promise<number>;
    listTxs(address: string): Promise<_Transaction>;
}

type Chain = "LTC" | "BTC";
type Network = "testnet" | "mainnet" | "regtest";
type Fee = Partial<{
    fee: number;
}>;
type ProgramMetaData =
    & JObject
    & Partial<{
        _amount: number;
        _owners: string[];
        _readers?: string[];
        _url?: string;
    }>;

interface FundOptions {
    fund?: boolean;
    include?: string[];
    exclude?: string[];
}
interface SigOptions {
    sign?: boolean;
    inputIndex?: number;
    sighashType?: number;
    inputScript?: Buffer;
}
interface MockOptions {
    mocks?: {
        [s: string]: Mock;
    };
}
type InscriptionOptions = Partial<{
    commitAmount: number;
    commitFee: number;
    revealAmount: number;
    revealFee: number;
    include: string[];
    exclude: string[];
}>;
type ComputerOptions = Partial<{
    chain: Chain;
    mnemonic: string;
    network: Network;
    passphrase: string;
    path: string;
    seed: string;
    url: string;
    satPerByte: number;
    dustRelayFee: number;
}>;

interface SecretOutput {
    data: string;
}
interface TransitionJSON {
    exp: string;
    env: {
        [s: string]: string;
    };
    mod: string;
}
interface Stored {
    _url: string;
}
interface Location {
    _rev: string;
    _root: string;
    _id: string;
    _owners: string[];
    _amount: number;
    _readers?: string[];
    _url?: string;
}
interface Encrypted {
    __cypher: string;
    __secrets: string[];
}

type Data = ProgramMetaData;
type Class = new(...args: any) => any;
type Query = Partial<{
    mod: string;
    publicKey: string;
    limit: number;
    offset: number;
    order: "ASC" | "DESC";
    ids: string[];
    hash: string;
}>;
type UserQuery<T extends Class> = Partial<{
    mod: string;
    publicKey: string;
    limit: number;
    offset: number;
    order: "ASC" | "DESC";
    ids: string[];
    contract: {
        class: T;
        args?: ConstructorParameters<T>;
    };
}>;

interface _Unspent {
    txId: string;
    vout: number;
    satoshis: number;
    rev?: string;
    scriptPubKey?: string;
    amount?: number;
    address?: string;
    height?: number;
}

interface _Input {
    txId: string;
    vout: number;
    script: string;
    sequence: string;
    witness: string[];
}
interface _Output {
    value: number;
    script: string;
    address?: string;
}

interface _Transaction {
    txId: string;
    txHex: string;
    vsize: number;
    version: number;
    locktime: number;
    ins: _Input[];
    outs: _Output[];
}
interface Utxo {
    hash: any;
    index: any;
    nonWitnessUtxo: Buffer;
}
interface Effect {
    res: Json;
    env: JObject;
}

declare class Contract {
    _id: string;
    _rev: string;
    _root: string;
    _amount: number;
    _owners: string[];
    constructor(opts?: {});
}

type StringOrArray<T> = string | Array<StringOrArray<T>>

declare class Memory {
    private static instance;
    private cells;
    txs: {
        [s: string]: {
            res?: string;
            env?: {
                [s: string]: string;
            };
        };
    };
    main: boolean;
    constructor(singleton?: boolean);
    getCell: (rev: string) => any;
    getCells: () => {
        [s: string]: any;
    };
    getTxs: () => {
        [s: string]: {
            res?: string | undefined;
            env?: {
                [s: string]: string;
            } | undefined;
        };
    };
    getBasic: (_rev: string) => any;
    getReachable: (visited?: string[]) => (rev: string) => string[];
    handleArrays: (index: {
        [s: string]: Json;
    }) => (pointerRev: StringOrArray<string>) => any;
    getRev: (rev: StringOrArray<string>) => {
        val: Json;
    };
    revToId: (rev: string) => string;
    idToRevs: (id: string) => string[];
    idToLatestRev: (id: string) => string;
    putCell: (rev: string, cell: any) => void;
    static renovatePointers: (zip: [string, string][]) => (revs: StringOrArray<string>) => StringOrArray<string>;
    static renovate: (zip: [string, string][]) => (oldCell: any) => any;
    update: (zip: [string, string][], effect: Effect, txId: string) => void;
    getTxId: (txId: string) => {
        env: {
            [k: string]: any;
        };
        res: Json;
    };
    getRevs: () => string[];
    getTxIds: () => string[];
    getIds: () => string[];
    hasRev: (rev: string) => boolean;
    hasTx: (txId: string) => boolean;
    clear: () => void;
    deleteCell: (rev: string) => void;
    deleteMocks: () => void;
    exploreBackPointers: (revs: string[]) => Set<string>;
    static fromMemories: (memories: Memory[]) => Memory;
    merge: (memory: Memory) => Memory;
}

declare class Computer {
    wallet: Wallet;
    constructor(params?: ComputerOptions);
    new<T extends Class>(constructor: T, args?: ConstructorParameters<T>, mod?: string): Promise<InstanceType<T> & Location>;
    lockdown(opts?: any): void;
    delete(inRevs: string[]): Promise<string>;
    decode(transaction: bTransaction): Promise<TransitionJSON>;
    encode(json: Partial<TransitionJSON & FundOptions & SigOptions & MockOptions>): Promise<{
        tx?: bTransaction;
        effect: Effect;
    }>;
    encodeNew<T extends Class>({ constructor, args, mod, }: {
        constructor: T;
        args: ConstructorParameters<T>;
        mod?: string;
        root?: string;
    }): Promise<{
        tx?: bTransaction;
        effect: Effect;
    }>;
    getUtxos(address?: string): Promise<string[]>;
    encodeCall<T extends Class, K extends keyof InstanceType<T>>({ target, property, args, mod, }: {
        target: InstanceType<T> & Location;
        property: string;
        args: Parameters<InstanceType<T>[K]>;
        mod?: string;
    }): Promise<{
        tx?: bTransaction;
        effect: Effect;
    }>;
    query<T extends Class>(q: UserQuery<T>): Promise<string[]>;
    deploy(module: string, opts?: Partial<InscriptionOptions>): Promise<string>;
    load(rev: string): Promise<any>;
    getChain(): Chain;
    getNetwork(): Network;
    getMnemonic(): string;
    getPrivateKey(): string;
    getPassphrase(): string;
    getPath(): string;
    getUrl(): string;
    getPublicKey(): string;
    getAddress(): string;
    setFee(fee: number): void;
    getFee(): number;
    getBalance(): Promise<number>;
    sign(transaction: bTransaction, opts?: SigOptions): Promise<void>;
    fund(tx: bTransaction, opts?: Fee & FundOptions): Promise<void>;
    broadcast(tx: bTransaction): Promise<string>;
    sync(rev: string): Promise<unknown>;
    send(satoshis: number, address: string): Promise<string>;
    rpcCall(method: string, params: string): Promise<any>;
    txFromHex({ hex }: {
        hex?: string | undefined;
    }): Promise<Transaction>;
    getInscription(rawTx: string, index: number): {
        contentType: string;
        body: string;
    };
    listTxs(address?: string): Promise<_Transaction>;
    export(module: string, opts?: Partial<InscriptionOptions>): Promise<string>;
    import(rev: string): Promise<any>;
    queryRevs(q: Query): Promise<string[]>;
    getOwnedRevs(publicKey?: Buffer): Promise<string[]>;
    getRevs(publicKey?: Buffer): Promise<string[]>;
    getLatestRevs(ids: string[]): Promise<string[]>;
    getLatestRev(id: string): Promise<string>;
    idsToRevs(ids: string[]): Promise<string[]>;
    faucet(amount: number, address?: string): Promise<_Unspent>;
    toScriptPubKey(publicKeys: string[]): Buffer;
}

export { Computer, Contract, Mock, Memory };