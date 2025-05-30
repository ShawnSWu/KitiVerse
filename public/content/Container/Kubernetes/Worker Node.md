### Worker Node 就像工廠裡的工人和他們手上的機器，負責實際幹活，把老闆的計劃變成現實。

## 責任
- **執行任務（Kubelet）**: 每個工人有個小助手（Kubelet），聽從老闆的指令，執行具體任務。比如，「你負責跑這個應用程式（Pod）」。
- **管理容器（Container Runtime）**: 工人手上有工具（像 Docker 或 containerd），用來啟動和管理應用程式（容器），確保它們正常運行。
- **報告狀態（Kubelet）**: 工人會隨時跟老闆回報，「我這邊的機器跑得好好的」或「有個容器壞了，救命！」。
- **網絡連接（Kube-Proxy）**: 工人之間還有個通訊員（Kube-Proxy），負責幫忙轉接電話（網絡流量），讓客戶能順利找到服務（Pod）。
## **生活化例子**:
  - 在披薩店裡，Worker Node 是廚師和烤箱。店長說「烤兩份披薩」，廚師就去準備麵團、放材料、開烤箱，然後把披薩烤好送出去。如果烤箱壞了，廚師會告訴店長，「老闆，機器壞了，快修！」
### 特點:
 - Worker Node 是「手腳」，負責實幹。
- 通常有很多個，因為工廠需要大量工人來完成任務。