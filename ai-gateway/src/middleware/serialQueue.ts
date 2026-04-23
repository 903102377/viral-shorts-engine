/**
 * 串行执行锁 (Serial Queue)
 * 
 * 所有浏览器自动化操作必须串行执行，防止两个 Playwright 请求
 * 同时操作同一个 Chrome 标签页导致崩溃。
 * 
 * 原理：维护一条 Promise 链，每个新请求 append 到链尾，
 * 等待前一个完成后才开始执行。
 * 
 * 未来可平滑升级为 BullMQ 等持久化队列。
 */

let chain: Promise<void> = Promise.resolve();
let queueLength = 0;

export function enqueue<T>(task: () => Promise<T>): Promise<T> {
  queueLength++;
  const position = queueLength;
  
  console.log(`[Queue] Task #${position} enqueued. Current queue depth: ${queueLength}`);
  
  const result = new Promise<T>((resolve, reject) => {
    chain = chain.then(async () => {
      console.log(`[Queue] Task #${position} starting execution...`);
      try {
        const res = await task();
        resolve(res);
      } catch (err) {
        reject(err);
      } finally {
        queueLength--;
        console.log(`[Queue] Task #${position} finished. Remaining: ${queueLength}`);
      }
    });
  });
  
  return result;
}

export function getQueueStatus() {
  return { pending: queueLength };
}
