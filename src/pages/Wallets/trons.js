import TronWeb from "tronweb";

const TronHelper = {
  tronWeb: null,
  isInstalled: !!window.tronWeb,

  async initTron() {
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider("https://api.trongrid.io");
    const solidityNode = new HttpProvider("https://api.trongrid.io");
    const eventServer = "https://api.trongrid.io/";
    let privateKey = "cd8c28fa9cad44c18e95a184e1809a6ec85a4f88772477f632e46b3f1a8ca502";
    
    const gettronWeb = new TronWeb({ fullHost: fullNode, privateKey });
    // const gettronWeb = new TronWeb(fullNode, solidityNode, eventServer);
    this.tronWeb = gettronWeb;

    const tronLoader = setInterval(() => {
      if (window.tronWeb && window.tronWeb.ready) {
        this.tronWeb = window.tronWeb;
        clearInterval(tronLoader);
      } else {
        this.tronWeb = gettronWeb;
      }
    }, 500);
  },
};

export default TronHelper;
