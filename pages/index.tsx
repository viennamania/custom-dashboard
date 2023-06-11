import { useEffect, useState } from "react";
import { ConnectWallet, useAddress, useSDK } from "@thirdweb-dev/react";

import { ContractType, ContractMetadata } from "@thirdweb-dev/sdk";

import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  contractTypeToDisplayNameMapping as nameMapping,
  contractTypeToImageMapping as imageMapping,
} from "../const/contractToDisplayMappings";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {

  const router = useRouter();
  const address = useAddress();

  const sdk = useSDK();

  const [loading, setLoading] = useState(true);

  /*
  const [existingContracts, setExistingContracts] = useState<
    {
      address: string;
      contractType: ContractType;
    }[]
  >([]);
  */

  const [existingContracts, setExistingContracts] = useState<
  {
    address: string;
    contractType: ContractType;
    //contractType: ContractMetadata;
  }[]
>([]);

/*
getContractList(walletAddress: string): Promise<{
  address: string;
  contractType: "custom" | "edition-drop" | "edition" | "marketplace" | "multiwrap" | "nft-collection" | "nft-drop" | "pack" | "signature-drop" | "split" | "token-drop" | "token" | "vote";
  metadata: () => Promise<any>;
}[]>;
*/
/*
Argument of type 'ContractWithMetadata[]' is not assignable to parameter of type 'SetStateAction<{ address: string; contractType: "custom" | "edition-drop" | "edition" | "marketplace" | "marketplace-v3" | "multiwrap" | "nft-collection" | "nft-drop" | "pack" | "signature-drop" | "split" | "token-drop" | "token" | "vote"; }[]>'.
  Type 'ContractWithMetadata[]' is not assignable to type '{ address: string; contractType: "custom" | "edition-drop" | "edition" | "marketplace" | "marketplace-v3" | "multiwrap" | "nft-collection" | "nft-drop" | "pack" | "signature-drop" | "split" | "token-drop" | "token" | "vote"; }[]'.
    Type 'ContractWithMetadata' is not assignable to type '{ address: string; contractType: "custom" | "edition-drop" | "edition" | "marketplace" | "marketplace-v3" | "multiwrap" | "nft-collection" | "nft-drop" | "pack" | "signature-drop" | "split" | "token-drop" | "token" | "vote"; }'.
      Types of property 'contractType' are incompatible.
        Type '() => Promise<"custom" | "edition-drop" | "edition" | "marketplace" | "marketplace-v3" | "multiwrap" | "nft-collecti
*/


  // Load the smart contracts whenever the address/signer changes.
  useEffect(() => {
    // If there's no address, we can't load contracts for this address.
    if (!address || !sdk) {
      return;
    }

    console.log("address", address);

    // Fetch the contracts for this address and set them in state
    /*
    sdk
      .getContractList(address)
      .then((contracts) => {

        console.log("contracts", contracts);

        //setExistingContracts(contracts);

      })
      .finally(() => setLoading(false));
    */

      const main = async () => {

        const contracts = await sdk.getContractList(address); 

        console.log("contracts", contracts);
      }

      main();

  }, [address, sdk]);

  return (
    <>
      {/* Content */}
      <div className={styles.container}>
        {/* Top Section */}
        <h1 className={styles.h1}>GRANDERBY Dashboard</h1>

        <hr className={styles.divider} />

        <h2>Your Contracts</h2>
        {!address ? (
          <>
            <p>
              <b>Connect Your Wallet to view your contracts</b>
            </p>
            <ConnectWallet
              //accentColor="#F213A4"
            />
          </>
        ) : (
          <>
            <Link href="/deploy" className={styles.mainButton}>
              Deploy a Contract
            </Link>
            <div className={styles.contractBoxGrid}>
              {loading && <p>Loading...</p>}
              {existingContracts.map((c) => (
                <div
                  className={styles.contractBox}
                  key={c.address}
                  onClick={() => router.push(`/${c.contractType}/${c.address}`)}
                >
                  <div className={styles.contractImage}>
                    <img
                      // @ts-ignore
                      src={imageMapping[c.contractType]}
                      alt={c.contractType}
                    />
                  </div>
                  <b className={styles.cardName}>
                    {/* @ts-ignore */}
                    {nameMapping[c.contractType]}
                  </b>
                  <p className={styles.cardDescription}>
                    {c.address.slice(0, 6) + "..." + c.address.slice(-4)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
