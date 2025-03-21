import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ResourceMultiSig from "../../../server/src/contracts/ResourceMultiSig.json";
import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";


interface Request {
    contractAddress: string;
    blockchainRequestId: string;
    executed: boolean;
}

const SignatureApproval = ({ request }: { request: Request }) => {
    const { web3, account } = useWeb3();
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        try {
            if (!web3) {
                toast.error('Web3 is not initialized');
                setLoading(false);
                return;
            }

            const contract = new web3.eth.Contract(
                ResourceMultiSig,
                request.contractAddress
            );

            await contract.methods.approveRequest(request.blockchainRequestId)
                .send({ from: account });

            toast.success('Approval submitted successfully');
        } catch (error) {
            toast.error('Approval failed');
        }
        setLoading(false);
    };

    return (
        <Button
            onClick={handleApprove}
            disabled={loading || request.executed}
        >
            {loading ? 'Signing...' : 'Approve'}
        </Button>
    );
};

export default SignatureApproval;

