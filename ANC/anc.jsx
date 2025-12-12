import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

// Single-file React component for an IDO landing page
// Tailwind CSS classes are used for styling (no imports here — assumes Tailwind is available in hosting environment)
// This component is ready to drop into a React app (Vite / Create React App / Next.js) and will render a professional IDO landing

export default function IDOANC() {
  // Replace these constants with your real values
  const TOKEN_SYMBOL = "ANC";
  const TOKEN_NAME = "Arjuna Nexus Capital";
  const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // <-- put token sale contract / ERC20 contract here
  const IDO_PRICE_USD = 0.01; // example
  const SOFT_CAP_USD = 150000;
  const HARD_CAP_USD = 500000;

  // Web3 state
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [buyAmount, setBuyAmount] = useState(100); // USD amount by default
  const [status, setStatus] = useState("");

  // Demo stats (in a real deployment you'd fetch these from backend / contract)
  const [raisedUSD, setRaisedUSD] = useState(32000);
  const [progressPercent, setProgressPercent] = useState(() => Math.min(100, (32000 / HARD_CAP_USD) * 100));

  useEffect(() => {
    setProgressPercent(Math.min(100, (raisedUSD / HARD_CAP_USD) * 100));
  }, [raisedUSD]);

  // Connect wallet (ethers) — simple implementation
  async function connectWallet() {
    try {
      if (!window.ethereum) {
        setStatus("No Ethereum provider found — install MetaMask.");
        return;
      }
      const p = new ethers.providers.Web3Provider(window.ethereum, "any");
      await p.send("eth_requestAccounts", []);
      const s = p.getSigner();
      const a = await s.getAddress();
      const net = await p.getNetwork();
      setProvider(p);
      setSigner(s);
      setAccount(a);
      setNetworkName(net.name + " (chainId:" + net.chainId + ")");
      setStatus("Wallet connected: " + a);
    } catch (err) {
      console.error(err);
      setStatus("Failed to connect wallet: " + (err.message || err));
    }
  }

  async function disconnectWallet() {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setNetworkName(null);
    setStatus("");
  }

  // Placeholder: simulate buy flow — in production call sale contract (e.g. saleContract.buyTokens())
  async function handleBuy() {
    if (!signer) {
      setStatus("Connect wallet first.");
      return;
    }
    try {
      setStatus("Preparing transaction...");

      // Example: convert USD to ETH at a fixed demo rate (in real use fetch price feed)
      // Here: assume 1 ETH = $2,000 for estimation — DO NOT rely on this number. Replace with oracle or backend.
      const ETH_USD = 2000;
      const ethValue = (buyAmount / ETH_USD).toFixed(6);

      // Example transaction: send ETH to sale contract address
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: ethers.utils.parseEther(String(ethValue)),
      });
      setStatus("Transaction submitted — waiting for confirmation...");
      await tx.wait();

      // Update demo raised amount locally
      setRaisedUSD((prev) => prev + Number(buyAmount));
      setStatus("Purchase confirmed! Tx: " + tx.hash);
    } catch (err) {
      console.error(err);
      setStatus("Transaction failed: " + (err.message || err));
    }
  }

  // UI components
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl ring-1 ring-gray-700">
              <span className="font-bold text-lg text-black">ANC</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Arjuna Nexus Capital</h1>
              <p className="text-sm text-gray-400">IDO • ANC Token • Network: Ethereum</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {account ? (
              <div className="text-right">
                <div className="text-sm">{account.substring(0, 6)}...{account.substring(account.length - 4)}</div>
                <div className="text-xs text-gray-400">{networkName}</div>
                <button onClick={disconnectWallet} className="mt-2 px-3 py-1 rounded-md bg-gray-800/50 hover:bg-gray-700">Disconnect</button>
              </div>
            ) : (
              <button onClick={connectWallet} className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-semibold shadow-lg hover:brightness-95">Connect Wallet</button>
            )}
          </div>
        </header>

        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">Join the ANC IDO — Arjuna Nexus Capital</h2>
            <p className="mt-4 text-gray-300">Premium fintech investment token. Limited allocation. Secure smart contract. Professional-grade tokenomics.</p>

            <div className="mt-6 flex gap-4 items-center">
              <div className="bg-gray-800/40 p-4 rounded-lg">
                <div className="text-xs text-gray-400">Soft Cap</div>
                <div className="text-xl font-bold">${SOFT_CAP_USD.toLocaleString()}</div>
              </div>

              <div className="bg-gray-800/40 p-4 rounded-lg">
                <div className="text-xs text-gray-400">Hard Cap</div>
                <div className="text-xl font-bold">${HARD_CAP_USD.toLocaleString()}</div>
              </div>

              <div className="bg-gray-800/40 p-4 rounded-lg">
                <div className="text-xs text-gray-400">IDO Price</div>
                <div className="text-xl font-bold">${IDO_PRICE_USD} / ANC</div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-400">Amount (USD)</label>
              <div className="mt-2 flex gap-2">
                <input type="number" value={buyAmount} onChange={(e) => setBuyAmount(Number(e.target.value))} className="w-40 px-3 py-2 rounded-md bg-gray-800/40 outline-none" />
                <button onClick={handleBuy} className="px-4 py-2 rounded-md bg-yellow-500 text-black font-semibold">Buy (Demo)</button>
              </div>
              <div className="mt-2 text-sm text-gray-400">Estimated ETH spent shown at checkout (demo rate). Always verify on-chain TX before confirming.</div>
            </div>

            <div className="mt-6">
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-2 text-sm text-gray-400">Raised: ${raisedUSD.toLocaleString()} • {Math.round(progressPercent)}% of hard cap</div>
            </div>
          </div>

          {/* Visual coin and circuit background */}
          <div className="flex items-center justify-center">
            <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-gray-800 to-black p-6 shadow-2xl ring-1 ring-gray-700 flex items-center justify-center">
              {/* Placeholder: replace src with production 3D coin image URL or imported asset */}
              <img src="/images/anc-3d-coin.png" alt="ANC 3D Coin" className="w-full h-full object-contain" />
            </div>
          </div>
        </section>

        {/* Tokenomics & Details */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="col-span-1 md:col-span-2 bg-gray-900/60 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Tokenomics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-400">Total Supply</div>
                <div className="font-bold text-lg">100,000,000</div>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-400">Public IDO</div>
                <div className="font-bold text-lg">20% (20,000,000)</div>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-400">Liquidity</div>
                <div className="font-bold text-lg">15% (15,000,000)</div>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-400">Team & Founder</div>
                <div className="font-bold text-lg">15% (15,000,000)</div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm text-gray-400">Distribution & Vesting</h4>
              <ul className="list-disc list-inside mt-2 text-gray-300">
                <li>Team: cliff 12 months + 24 months vesting</li>
                <li>Liquidity: locked 12 months</li>
                <li>Treasury: linear unlock 36 months</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-900/60 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">IDO Details</h3>
            <div className="text-sm text-gray-300">Soft Cap: ${SOFT_CAP_USD.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Hard Cap: ${HARD_CAP_USD.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Price: ${IDO_PRICE_USD} / ANC</div>
            <div className="text-sm text-gray-300 mt-3">Accepted: ETH / USDT / USDC</div>
            <div className="text-sm text-gray-300 mt-3">Minimum: $50 • Maximum: $5,000</div>

            <a href={`https://etherscan.io/token/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="inline-block mt-6 px-4 py-2 rounded-md bg-gray-800/50">View Token on Etherscan</a>
          </div>
        </section>

        {/* Roadmap & Team */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/60 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Roadmap</h3>
            <ol className="space-y-4 text-gray-300">
              <li><strong>Q1</strong> — Audit, website, branding</li>
              <li><strong>Q2</strong> — IDO, liquidity lock, listing on DEX</li>
              <li><strong>Q3</strong> — Launchpad & partnerships</li>
              <li><strong>Q4</strong> — CEX listings & global campaign</li>
            </ol>
          </div>

          <div className="bg-gray-900/60 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Team & Advisors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 mb-3 flex items-center justify-center">A</div>
                <div className="font-bold">Founder</div>
                <div className="text-xs text-gray-400">Lead</div>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 mb-3 flex items-center justify-center">B</div>
                <div className="font-bold">CTO</div>
                <div className="text-xs text-gray-400">Blockchain</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer / Legal */}
        <footer className="mt-12 text-center text-gray-400">
          <div className="max-w-2xl mx-auto">
            <p className="mb-3">Arjuna Nexus Capital — ANC Token. This page is a demo IDO interface. Always verify smart contract addresses and audit status before participating in any token sale. We are not financial advisors.</p>

            <div className="flex items-center justify-center gap-4 text-sm">
              <a href="#" className="hover:underline">Whitepaper (PDF)</a>
              <a href="#" className="hover:underline">Audit Report</a>
              <a href="#" className="hover:underline">Contact</a>
            </div>

            <div className="mt-6 text-xs text-gray-600">© {new Date().getFullYear()} Arjuna Nexus Capital</div>
          </div>
        </footer>
      </div>

      {/* Small status bar for debugging */}
      {status && (
        <div className="fixed left-6 bottom-6 bg-black/60 text-gray-100 px-4 py-3 rounded-lg shadow-xl max-w-xl">
          <div className="text-sm">{status}</div>
        </div>
      )}
    </div>
  );
}
