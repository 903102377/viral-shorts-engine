import { generatePromptWithDoubaoWeb } from './doubao-automator.js';

async function testFull() {
    try {
        console.log("=== 启动豆包全链路测试 ===");
        const result = await generatePromptWithDoubaoWeb(
            "你是一个负责测试删除功能的助手。如果我问你问题，请用一句话回答。",
            "请问今天天气怎么样？（随便编一个即可）",
            false
        );
        console.log("\n【测试成功，提取到回复】:");
        console.log(result);
        console.log("\n=====================\n注意观察浏览器，当前对话是否已经被自动删除。");
    } catch (e: any) {
        console.error("测试失败:", e);
    }
}

testFull();
