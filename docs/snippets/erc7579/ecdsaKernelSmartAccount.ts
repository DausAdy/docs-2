import { publicClient } from "../publicClient"
import { createSmartAccountClient } from "permissionless"
import { sepolia } from "viem/chains"
import { http } from "viem"
import { entryPoint07Address } from "viem/account-abstraction"
import { createPimlicoClient } from "permissionless/clients/pimlico"
import { erc7579Actions } from "permissionless/actions/erc7579"
import { owner } from "../owner"
import { toEcdsaKernelSmartAccount } from "permissionless/accounts"

const apiKey = "YOUR_PIMLICO_API_KEY"
const pimlicoUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`

const pimlicoClient = createPimlicoClient({
	transport: http(pimlicoUrl),
	chain: sepolia,
	entryPoint: {
		address: entryPoint07Address,
		version: "0.7",
	},
})

const kernelAccount = await toEcdsaKernelSmartAccount({
	client: publicClient,
	owners: [owner],
	version: "0.3.1",
})

// Extend the client with the ERC7579 actions
const smartAccountClient = createSmartAccountClient({
	account: kernelAccount,
	chain: sepolia,
	bundlerTransport: http(pimlicoUrl),
	paymaster: pimlicoClient,
	userOperation: {
		estimateFeesPerGas: async () => {
			return (await pimlicoClient.getUserOperationGasPrice()).fast
		},
	},
}).extend(erc7579Actions())
