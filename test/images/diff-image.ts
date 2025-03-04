import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export async function diffImage(image: string, screenshot: Uint8Array<ArrayBufferLike>, diffName: string) {
  const baselineImagePath = image;

  if (fs.existsSync(baselineImagePath)) {
    const baseline = PNG.sync.read(fs.readFileSync(baselineImagePath));
    const current = PNG.sync.read(Buffer.from(screenshot));
    
    const { width, height } = baseline;
    const diff = new PNG({ width, height });
    
    const numDiffPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 } // 阈值可以根据需要调整
    );

    if (numDiffPixels > 0) {
      console.log(`检测到 ${numDiffPixels} 个像素不同`);
      // 可选：保存差异图片
      fs.writeFileSync(`./test/images/${diffName}.png`, PNG.sync.write(diff));
    } else {
      console.log('图片完全一致');
    }
  } else {
    // 如果基准图片不存在，保存当前截图作为基准
    fs.writeFileSync(baselineImagePath, screenshot);
    console.log('已保存基准图片');
  }
}
