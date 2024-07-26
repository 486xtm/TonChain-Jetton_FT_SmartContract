import { Address, beginCell, toNano } from 'ton-core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton-community/blueprint';
export type JettonMinterContent = {
    type:0|1,
    uri:string
};
export function jettonContentToCell(content:JettonMinterContent) {
    return beginCell()
                      .storeUint(content.type, 8)
                      .storeStringTail(content.uri) //Snake logic under the hood
           .endCell();
}
const contentUrl = "https://react-unity-maze-game.vercel.app/manifest.json";
const content = jettonContentToCell({type: 1, uri: contentUrl})
export async function run(provider: NetworkProvider) {

    const randomSeed = Math.floor(Math.random() * 10000);

    const jettonMinter = provider.open(JettonMinter.createFromConfig({
        
        adminAddress: provider.sender().address as Address,
        content: content,
        jettonWalletCode: await compile('JettonWallet')

    }, await compile('JettonMinter')));

    await jettonMinter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(jettonMinter.address);

    // run methods on `jettonMinter`
}
