# 简单VPN软件开发指南

## 概述
本文档详细描述了如何开发一个简单的VPN软件，使用V2Ray作为内核，支持Android和PC平台。应用聚焦简单易用：通过订阅接口导入节点、按节点名字顺序排序列表、连接后单个测速（不批量）、现代UI（参考Speedtest的仪表盘和Figma的流畅交互）。后端使用Cloudflare反向代理（Tunnel）驱动订阅和节点管理。付费功能包括微信支付和支付宝，广告接口预留。

**关键特性**：
- 内核：V2Ray Core（开源，支持VMess、VLESS等协议）。
- 订阅：从CF代理的API拉取节点列表（JSON格式）。
- 测速：仅连接后测试（下载/上传/延迟），使用HTTP基准测试。
- 排序：节点按名字顺序（e.g., "Node A", "Node B"）。
- UI：现代化、简洁（渐变背景、一键连接、仪表盘测速）。
- 付费/广告：免费版限功能，付费解锁高级节点或去广告。
- 平台：Android (Kotlin/Jetpack Compose)，PC (Electron.js + React，选型理由：最简单跨平台，JS熟悉度高，UI良好，支持现代组件如Material-UI)。

**前提**：
- 编程经验（Kotlin/JS）。
- Cloudflare账号设置Tunnel（参考Cloudflare文档）。
- V2Ray Core二进制/库。
- 支付宝/微信商户账号。
- 测试设备/模拟器。

文档分为Android端和PC端两部分，每部分包括设计、开发步骤、代码示例和测试。

---

## Android端开发

### 1. 技术栈
- **语言**：Kotlin（现代、简洁）。
- **UI**：Jetpack Compose（响应式、现代UI，易实现Figma原型）。
- **V2Ray集成**：v2ray-android库（GitHub: V2Ray-Android）。
- **网络**：OkHttp（订阅拉取、测速）。
- **付费**：支付宝SDK、微信OpenSDK。
- **广告**：Google AdMob。
- **构建**：Android Studio，minSdk 21。

### 2. 项目结构
```
app/
├── src/
│   ├── main/
│   │   ├── java/com/example/vpn/  # 核心逻辑
│   │   │   ├── MainActivity.kt
│   │   │   ├── VpnService.kt     # VPN服务
│   │   │   ├── ApiClient.kt      # 订阅API
│   │   │   ├── SpeedTest.kt      # 测速
│   │   │   ├── PaymentManager.kt # 支付
│   │   └── res/                  # 资源
│   └── AndroidManifest.xml
└── build.gradle
```

### 3. UI设计（Figma原型实现）
- 使用Figma设计：首页（连接按钮、节点列表）、订阅页（输入URL）、测速页（仪表盘）、设置页（付费）。
- Compose实现：
  - 主题：Material3，渐变背景（e.g., LinearGradient）。
  - 组件：Button（一键连接）、LazyColumn（节点列表，按name排序）、CircularProgressIndicator（测速动画）。

示例Compose代码（首页）：
```kotlin
@Composable
fun HomeScreen(nodes: List<Node>, onConnect: (Node) -> Unit) {
    val sortedNodes = nodes.sortedBy { it.name }
    Column(modifier = Modifier.fillMaxSize().background(Brush.linearGradient(...))) {
        Button(onClick = { /* 连接逻辑 */ }) { Text("Connect") }
        LazyColumn {
            items(sortedNodes) { node ->
                Card { Text(node.name) }
            }
        }
    }
}
```

### 4. 订阅接口集成
- 从CF Tunnel URL拉取节点（e.g., https://api.yourdomain.com/subscribe）。
- 解析JSON：List<{name: String, config: String}>（config为VMess Base64）。

示例代码：
```kotlin
class ApiClient {
    private val client = OkHttpClient()
    fun fetchNodes(subUrl: String): List<Node> {
        val request = Request.Builder().url(subUrl).build()
        val response = client.newCall(request).execute()
        val json = JSONArray(response.body.string())
        return (0 until json.length()).map { i ->
            val obj = json.getJSONObject(i)
            Node(obj.getString("name"), obj.getString("config"))
        }.sortedBy { it.name }
    }
}
```

### 5. V2Ray内核集成
- 添加依赖：`implementation 'com.github.V2Ray-Android:libv2ray:1.5.+'`。
- 创建VpnService启动V2Ray。

示例：
```kotlin
class MyVpnService : VpnService() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val config = intent?.getStringExtra("CONFIG") // 从订阅获取
        Libv2ray.startV2Ray(this, config)
        return START_STICKY
    }
}
```

### 6. 测速功能
- 仅连接后测试：下载测试文件计算速度。

示例：
```kotlin
fun testSpeed(onResult: (Double, Double, Int) -> Unit) { // 下载, 上传, 延迟
    coroutineScope.launch {
        val start = System.currentTimeMillis()
        val response = OkHttpClient().newCall(Request.Builder().url("http://speedtest.net/100mb.bin").build()).execute()
        val dlSpeed = (100 * 1024 * 1024 * 8) / (System.currentTimeMillis() - start) / 1000.0 // Mbps
        // 类似上传和ping测试
        onResult(dlSpeed, upSpeed, latency)
    }
}
```

### 7. 付费和广告
- 支付宝：添加`implementation 'com.alipay.sdk:alipaysdk-android:15.8.+'`。
- 微信：`implementation 'com.tencent.mm.opensdk:wechat-sdk-android-without-mta:6.8.+'`。
- 广告：`implementation 'com.google.android.gms:play-services-ads:22.+'`。

示例支付：
```kotlin
fun payWithAlipay(activity: Activity, orderInfo: String) {
    AlipaySDK.getInstance().payV2(activity, orderInfo, true, object : AlipaySDK.PayV2Callback {
        override fun onResult(result: PayResult) { /* 处理 */ }
    })
}
```

### 8. 测试和发布
- 测试：Android Emulator，检查VPN权限、CF连接。
- 发布：Google Play，签名APK。
- 潜在问题：VPN需要用户授权，CF Tunnel延迟。

---

## PC端开发

### 1. 技术栈选型
- **语言**：JavaScript（最简单，生态丰富）。
- **框架**：Electron.js（跨平台Windows/Mac/Linux，最简单方式构建桌面app，使用Web技术开发UI，门槛低）。
- **UI**：React + Material-UI（良好现代UI，参考Speedtest：简洁仪表、响应式；易实现Figma原型，比Tkinter等原生UI更美观、简单）。
- **V2Ray集成**：嵌入V2Ray Go二进制，使用child_process。
- **网络**：Axios（订阅、测速）。
- **付费**：WebView嵌入支付宝/微信支付页面（简单，无需原生SDK）。
- **广告**：Google Adsense（Web集成）。
- **构建**：Electron Builder，输出exe/dmg。

理由：Electron是最简单UI良好的选型——用熟悉的Web栈（HTML/JS/CSS）建现代UI，无需学新语言；React确保UI流畅；比Qt/PyQt简单，不需编译复杂依赖。

### 2. 项目结构
```
project/
├── src/
│   ├── main/          # Electron主进程
│   │   └── index.js
│   ├── renderer/      # 渲染进程（UI）
│   │   ├── App.js     # React入口
│   │   ├── Home.jsx   # 首页
│   │   └── Api.js     # 订阅
│   └── assets/        # V2Ray二进制
├── package.json
└── electron-builder.yml
```

### 3. UI设计（Figma原型实现）
- Figma同Android：导出到React组件。
- React实现：Material-UI组件（Button, List, CircularProgress）。

示例React代码（首页）：
```jsx
import React from 'react';
import { Button, List, ListItem } from '@mui/material';

function Home({ nodes, onConnect }) {
  const sortedNodes = nodes.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div style={{ background: 'linear-gradient(to bottom, #blue, #white)' }}>
      <Button onClick={onConnect}>Connect</Button>
      <List>
        {sortedNodes.map(node => <ListItem key={node.name}>{node.name}</ListItem>)}
      </List>
    </div>
  );
}
```

### 4. 订阅接口集成
- Axios拉取CF URL。

示例：
```js
const axios = require('axios');
async function fetchNodes(subUrl) {
  const response = await axios.get(subUrl);
  return response.data.sort((a, b) => a.name.localeCompare(b.name));
}
```

### 5. V2Ray内核集成
- 下载V2Ray Core二进制，放在assets。
- 使用child_process启动。

示例：
```js
const { spawn } = require('child_process');
function startVpn(config) {
  const v2ray = spawn('./assets/v2ray', ['run', '-c', config]);
  v2ray.on('error', err => console.error(err));
}
```

### 6. 测速功能
- 连接后使用Axios测试。

示例：
```js
async function testSpeed() {
  const start = Date.now();
  const response = await axios.get('http://speedtest.net/100mb.bin', { responseType: 'arraybuffer' });
  const dlSpeed = (100 * 1024 * 1024 * 8) / (Date.now() - start) / 1000; // Mbps
  // 类似上传和ping
  return { dlSpeed };
}
```

### 7. 付费和广告
- 支付：用WebView加载支付宝/微信支付URL。
- 广告：嵌入Adsense脚本。

示例WebView：
```js
const { BrowserWindow } = require('electron');
function openPayment(url) {
  const win = new BrowserWindow({ width: 600, height: 800 });
  win.loadURL(url);
}
```

### 8. 测试和发布
- 测试：`npm run start`，检查CF连接、V2Ray运行。
- 发布：`electron-builder`，生成安装包。
- 潜在问题：跨平台二进制兼容，Electron内存占用。