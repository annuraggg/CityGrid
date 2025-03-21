import { ethers } from "ethers";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "../config/s3.js";

const INFURA_URL = process.env.INFURA_RPC_URL!;
const CONTRACT_ADDRESS = process.env.DOC_VERI_CONTRACT_ADDRESS!;
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "documentId",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
            }
        ],
        "name": "DocumentHashStored",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isVerified",
                "type": "bool"
            }
        ],
        "name": "HashVerified",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "documentId",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
            }
        ],
        "name": "storeDocumentHash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "documentId",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
            }
        ],
        "name": "verifyDocumentHash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "documentId",
                "type": "string"
            }
        ],
        "name": "getDocumentHash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

export const getFileFromS3 = async (documentId: string): Promise<Buffer> => {
    try {
        const Document = await import("../models/Document.js").then(m => m.default);
        const Project = await import("../models/Project.js").then(m => m.default);

        const doc = await Document.findOne({ id: documentId });
        if (!doc) throw new Error("Document not found");

        const project = await Project.findOne({ documents: doc._id });
        if (!project) throw new Error("Project not found for document");

        const command = new GetObjectCommand({
            Bucket: process.env.R2_DOC_BUCKET!,
            Key: `${project._id}/${doc.id}.pdf`,
        });

        const response = await r2Client.send(command);
        if (!response.Body) throw new Error("Empty response body");

        return await streamToBuffer(response.Body as any);
    } catch (error) {
        console.error("Error retrieving file from S3:", error);
        throw new Error("Failed to retrieve file from storage");
    }
};

const streamToBuffer = async (stream: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];

        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
};

export const getDocumentHash = async (documentId: string) => {
    try {
        const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        return contract.getDocumentHash(documentId);
    } catch (error) {
        console.error("Error getting document hash from blockchain:", error);
        throw new Error("Failed to retrieve hash from blockchain");
    }
};

export const storeDocumentHash = async (documentId: string, hash: string) => {
    try {
        const bytes32Hash = ethers.utils.hexZeroPad(ethers.utils.hexlify('0x' + hash), 32);
        const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const tx = await contract.storeDocumentHash(documentId, bytes32Hash);
        await tx.wait();
        console.log(`Document hash stored on blockchain: ${documentId}`);
        return tx;
    } catch (error) {
        console.error("Error storing document hash on blockchain:", error);
        throw new Error("Failed to store hash on blockchain");
    }
};

export const verifyDocumentHash = async (documentId: string, hash: string) => {
    try {
        const bytes32Hash = ethers.utils.hexZeroPad(ethers.utils.hexlify('0x' + hash), 32);
        const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        return contract.verifyDocumentHash(documentId, bytes32Hash);
    } catch (error) {
        console.error("Error verifying document hash on blockchain:", error);
        throw new Error("Failed to verify hash on blockchain");
    }
};

export const compareHashes = async (documentId: string, currentHash: string) => {
    try {
        const storedHashBytes32 = await getDocumentHash(documentId);
        console.log(`Stored hash on blockchain: ${storedHashBytes32}`);
        console.log(`Current file hash: 0x${currentHash}`);

        const storedHashHex = ethers.utils.hexDataSlice(storedHashBytes32, 0, 32).substring(2);
        const result = currentHash === storedHashHex;

        console.log(`Hash comparison result: ${result}`);
        return result;
    } catch (error) {
        console.error("Error comparing document hashes:", error);
        throw new Error("Failed to compare document hashes");
    }
};