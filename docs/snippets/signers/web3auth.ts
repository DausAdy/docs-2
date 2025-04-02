const clientId =
	"iyoK-C3TBDiMvlXJFR8lIiC35JGoDMw8VrhE77k-xX6W2mOkZjhvU2J2t3NyuG7tkPsI2MrGv1RyiNlSwaFD5gL"

// [!region main]
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base"
import { Web3Auth } from "@web3auth/modal"
import { EIP1193Provider } from "viem"

// Config options here will be specific to your project.  See the Web3Auth docs for more info.
const web3auth = new Web3Auth({
	clientId,
	chainConfig: {
		chainNamespace: CHAIN_NAMESPACES.EIP155,
		chainId: "0xaa36a7",
		rpcTarget: "https://sepolia.rpc.thirdweb.com",
		displayName: "Sepolia Testnet",
		blockExplorer: "https://sepolia.etherscan.io",
		ticker: "ETH",
		tickerName: "Ethereum",
	},
	uiConfig: {},
	web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
})

// Get the Provider and EOA address (this will be the address of the signer) from Web3Auth
const smartAccountOwner = web3auth.provider as EIP1193Provider

if (!smartAccountOwner) {
	throw new Error("No provider found")
}
// [!endregion main]
