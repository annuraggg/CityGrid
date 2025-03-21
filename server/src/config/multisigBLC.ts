import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';
import type { AbiItem } from 'web3-utils';
import ResourceMultiSigABI from '../contracts/ResourceMultiSig.json' with { type: 'json' };

interface ResourceRequestData {
    requestingHOD: string;
    providingHOD: string;
    resourceId: string;
    quantity: number;
}

interface Contract extends Web3.Contract<AbiItem[]> {
    [key: string]: any;
}

const initContract = async (): Promise<Contract> => {
    if (!process.env.PRIVATE_KEY || !process.env.INFURA_API_KEY) {
        throw new Error('Missing environment variables');
    }

    const provider = new HDWalletProvider({
        privateKeys: [process.env.PRIVATE_KEY],
        providerOrUrl: `https://${process.env.BLOCKCHAIN_NETWORK}.infura.io/v3/${process.env.INFURA_API_KEY}`
    });

    const web3 = new Web3(provider as any);
    return new web3.eth.Contract(
        ResourceMultiSigABI as AbiItem[],
        process.env.MULTISIG_CONTRACT_ADDRESS
    ) as unknown as Contract;
};

export const createResourceRequest = async (
    requestData: ResourceRequestData
): Promise<{ transactionHash: string; requestId: string }> => {
    try {
        const contract = await initContract();
        const accounts = await contract.web3.eth.getAccounts();

        const result = await contract.methods
            .createRequest(
                requestData.requestingHOD,
                requestData.providingHOD,
                requestData.resourceId,
                requestData.quantity
            )
            .send({
                from: accounts[0],
                gas: 500000,
                gasPrice: await contract.web3.eth.getGasPrice()
            });

        return {
            transactionHash: result.transactionHash,
            requestId: result.events.RequestCreated.returnValues.requestId
        };
    } catch (error) {
        console.error('Error creating resource request:', error);
        throw new Error('Failed to create blockchain resource request');
    }
};

export const listenForApprovals = async (): Promise<void> => {
    try {
        const contract = await initContract();
        contract.events.ApprovalAdded({})
            .on('data', async (event: any) => {
                console.log('New approval received:', event);
            })
            .on('error', (error: Error) => {
                console.error('Approval listener error:', error);
            });
    } catch (error) {
        console.error('Error initializing approval listener:', error);
    }
};

export const getRequestStatus = async (
    requestId: string
): Promise<{ approved: boolean; executed: boolean }> => {
    try {
        const contract = await initContract();
        const request = await contract.methods.requests(requestId).call();

        return {
            approved: request.pmApproved && request.reqHODApproved && request.provHODApproved,
            executed: request.executed
        };
    } catch (error) {
        console.error('Error getting request status:', error);
        throw new Error('Failed to retrieve request status from blockchain');
    }
};