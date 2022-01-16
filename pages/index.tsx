import { useEffect, useState } from "react";
import axios from 'axios';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ethers } from 'ethers'
import Web3Modal from 'web3modal';

import {
  poolNoodleAddress, boatCruiseAddress
} from "../config"

// Get ABI from artifacts folder (how ethers client knows how to work with the blockchain)
import PoolNoodleNFT from "../artifacts/contracts/PoolNoodleNFT.sol/PoolNoodleNFT.json"
import BoatCruise from "../artifacts/contracts/BoatCruise.sol/BoatCruise.json"

export default function Home() {
  // load Pool Noodle NFTs as an array (empty at start)
  const [poolNoodles, setPoolNoodles] = useState([])
  // loading state allows us to update this (when app loads) to show/hide the UI
  const [loadingState, setLoadingState] = useState('not-loaded')

  // Load Pool Noodle NFTs
  useEffect(() => {
    loadPoolNoodles()
  }, [])

  async function loadPoolNoodles() {
    const provider = new ethers.providers.JsonRpcProvider()
    const poolNoodleContract = new ethers.Contract(poolNoodleAddress, PoolNoodleNFT.abi, provider)
    const boatCruiseContract = new ethers.Contract(boatCruiseAddress, BoatCruise.abi, provider)
    const data = await boatCruiseContract.fetchPoolNoodles()

    // create an array of items and map over them
    const items = await Promise.all(data.map(async (i: any) => {
      const tokenUri = await poolNoodleContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      // format wei into a number we can use
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setPoolNoodles(items[0])
    setLoadingState('loaded')
  }

  // If person loads app and no Pool Noodles have been created before
  if (loadingState === 'loaded' && !poolNoodles.length) return (
    <h1 className="px-20 py-10 text-3xl">No Pool Noodles in the Boat Cruise</h1>
  )

  // connect to web3 wallet for user
  async function buyPoolNoodle(poolNoodle: any) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    // map over Pool Noodles
    const signer = provider.getSigner()
    // get reference to contract
    const contract = new ethers.Contract(boatCruiseAddress, BoatCruise.abi, signer)
    // get price of Pool Noodle
    const price = ethers.utils.parseUnits(poolNoodle.price.toString(), 'ether')

    const transaction = await contract.createPoolNoodleSale(poolNoodleAddress, poolNoodle.tokenId, {
      value: price
    })

    // reload screen and remove that Pool Noodle from screen (should show one less Pool Noodle)
    await transaction.wait()
    loadPoolNoodles()

  }

  return (
    <div className={styles.container}>
      <h1>Pool Noodles</h1>
      
    </div>
  )
}
