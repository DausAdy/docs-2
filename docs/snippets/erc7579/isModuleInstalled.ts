import { publicClient } from "../publicClient"
import { createSmartAccountClient } from "permissionless"
import { sepolia } from "viem/chains"
import { encodePacked, http } from "viem"
import { entryPoint07Address } from "viem/account-abstraction"
import { createPimlicoClient } from "permissionless/clients/pimlico"

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

// [!region safe-smart-account-client]
import { erc7579Actions } from "permissionless/actions/erc7579"
import { owner } from "../owner"
import { toSafeSmartAccount } from "permissionless/accounts"

const safeAccount = await toSafeSmartAccount({
	client: publicClient,
	owners: [owner],
	entryPoint: {
		address: entryPoint07Address,
		version: "0.7",
	}, // global entrypoint
	version: "1.4.1",
})

// Extend the client with the ERC7579 actions
const smartAccountClient = createSmartAccountClient({
	account: safeAccount,
	chain: sepolia,
	bundlerTransport: http(pimlicoUrl),
	paymaster: pimlicoClient,
	userOperation: {
		estimateFeesPerGas: async () => {
			return (await pimlicoClient.getUserOperationGasPrice()).fast
		},
	},
}).extend(erc7579Actions())

const ownableExecutorModule = "0x4Fd8d57b94966982B62e9588C27B4171B55E8354"
const moduleData = encodePacked(["address"], ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"])
const isInstalled = await smartAccountClient.isModuleInstalled({
	type: "executor",
	address: ownableExecutorModule,
	context: moduleData,
})

// [!endregion safe-smart-account-client]

console.log(isInstalled)
