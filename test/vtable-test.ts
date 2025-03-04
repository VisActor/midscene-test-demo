import puppeteer from "puppeteer";
import os from "node:os";
import { PuppeteerAgent } from "@midscene/web/puppeteer";
import "dotenv/config"; // read environment variables from .env file
import option from "./data/vtable-option.json";
import { diffImage } from "./images/diff-image";

const URL = "http://127.0.0.1:8080";
Promise.resolve(
  (async () => {
    const browser = await puppeteer.launch({
      headless: false, // 'true' means we can't see the browser window
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 768,
      deviceScaleFactor: os.platform() === "darwin" ? 2 : 1, // this is used to avoid flashing on UI Mode when doing screenshot on Mac
    });

    await page.goto(URL);
    
    await page.evaluate(
      (option) => {
        const CONTAINER_ID = "visactor-container";

        // @ts-ignore
        const vtable = new window.VTable.ListTable(document.getElementById(CONTAINER_ID), option);
        // @ts-ignore
        window.vtableInstance = vtable;
      },
      option
    );

    await page.waitForSelector('canvas');

    // init Midscene agent
    const agent = new PuppeteerAgent(page);

    // 获取表格中第一列第一行的内容
    const items = await agent.aiQuery('表格中第一列第一行的内容');
    console.log('表格中第一列第一行的内容', items);

    // 点击表格第一列的 Order ID 右侧的排序按钮
    await agent.aiAction('点击表格第一列的 Order ID 右侧的排序按钮');

    // 断言表格中第一列第二行的内容为CA-2015-105417。返回一个 Promise，当断言成功时解析为 void；若断言失败，则抛出一个错误，错误信息包含 errorMsg 以及 AI 生成的原因
    await agent.aiAssert('表格中第一列第二行的内容为 CA-2015-105417',);
    console.log('断言表格中第一列第二行的内容为CA-2015-105417', '断言成功！');

    // 表格向下滚动120px
    await agent.aiAction('表格向下滚动120px');

    // 断言表格中第一列第三行的内容为CA-2015-112326
    await agent.aiAssert('表格中第一列第三行的内容为 CA-2015-112326');
    console.log('断言表格中第一列第三行的内容为CA-2015-112326', '断言成功！');

    const screenshot = await page.screenshot();

    // 对比标准图片
    await diffImage('./test/images/vtable-test.png', screenshot, 'vtable-diff');

    await browser.close();
  })()
);
