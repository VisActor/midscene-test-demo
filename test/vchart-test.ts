import puppeteer from "puppeteer";
import os from "node:os";
import { PuppeteerAgent } from "@midscene/web/puppeteer";
import "dotenv/config"; // read environment variables from .env file
import spec from "./data/vchart-spec.json";
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
      (spec) => {
        const CONTAINER_ID = "visactor-container";

        // @ts-ignore
        const vchart = new window.VChart.default(spec, {
          dom: CONTAINER_ID,
          animation: false,
        });
        vchart.renderSync();
      },
      spec
    );

    await page.waitForSelector('canvas');

    // init Midscene agent
    const agent = new PuppeteerAgent(page);

    // 点击折线图中的 USA 图例
    await agent.aiAction('点击折线图中的 USA 图例');

    // 获取折线图中Y轴中的全部标签
    const items = await agent.aiQuery('折线图中Y轴中的全部标签');
    console.log('Y轴中的全部标签', items);

    // 断言折线图中Y轴的最大标签为20000。返回一个 Promise，当断言成功时解析为 void；若断言失败，则抛出一个错误，错误信息包含 errorMsg 以及 AI 生成的原因
    await agent.aiAssert('折线图中Y轴的最大标签为20000');
    console.log('断言折线图中Y轴的最大标签为20000', '断言成功！');

    const screenshot = await page.screenshot();

    // 对比标准图片
    await diffImage('./test/images/vchart-test.png', screenshot, 'vchart-diff');
    
    await browser.close();
  })()
);
