# VisActor Midscene.js Test Demo

Use [Midscene.js](https://github.com/web-infra-dev/midscene) to test [VChart](https://github.com/VisActor/VChart) and [VTable](https://github.com/VisActor/VTable).

## Steps

create `.env` file

```shell
# replace by your own, example(qwen):
OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
OPENAI_API_KEY="YOUR_TOKEN"
MIDSCENE_MODEL_NAME="qwen-vl-max-latest"
MIDSCENE_USE_QWEN_VL=1
```

run demo

```bash
pnpm install 

# run vchart demo
pnpm run start-test-vchart

# run vtable demo
pnpm run start-test-vtable
```

# Reference 

https://midscenejs.com/integrate-with-puppeteer.html
https://midscenejs.com/api.html
https://www.visactor.com/vchart
https://www.visactor.com/vtable