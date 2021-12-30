import React, { Component } from 'react';
import logo from '../logo.png';
import Web3 from 'web3';
import './App.css';
import Color from '../abis/Color.json';
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
      balance: '0',
      contract: null,
      colors: [],
    };
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = Color.networks[networkId];
    if (networkData) {
      const abi = Color.abi;
      const address = networkData.address;
      const contract = await new web3.eth.Contract(abi, address);
      this.setState({ contract: contract });
      const totalSupply = await contract.methods.totalSupply().call();
      this.setState({ totalSupply: totalSupply });
      for (let i = 0; i < totalSupply; i++) {
        const color = await contract.methods.colors(i).call();
        this.setState({ colors: [...this.state.colors, color] }); // add to colors array
      }
    } else {
      window.alert('Smart contract not deployed to detected network.');
    }
  }
  
  mint = (color) => {
    console.log('minting color: ', color);
    this.state.contract.methods.mint(color).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ colors : [...this.state.colors, color] });
      });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="/"
            rel="noopener noreferrer"
          >
            Color NFT
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
               <h1>Mint Token</h1>
                <form onSubmit={(event) =>{
                  event.preventDefault();
                  const color = this.color.value
                  this.mint(color);
                }}>
                  <input
                    type="text"
                    className='form-control mb-1'
                    placeholder='Color Hex ex: #ffffff'
                    ref={(input) => { this.color = input; }} // ref is a react thing that allows us to access the input element 
                  />
                  <input type="submit" value="Mint" className="btn btn-primary" />  
                </form>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            { this.state.colors.map((color, index) => {
              return (
                <div className="col-sm-4" key={index}>
                  <div className="token" style={{backgroundColor: color}}></div>
                   <div>{color}</div>
                  
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default App;
