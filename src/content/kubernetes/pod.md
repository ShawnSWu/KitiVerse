# Kubernetes Pod

## 什麼是 Pod？
Pod 是 Kubernetes 中最小的可部署單元。一個 Pod 可以包含一個或多個容器，這些容器共享存儲和網絡資源。

## Pod 的生命週期
1. **Pending**: Pod 已被系統接受，但一個或多個容器尚未創建
2. **Running**: Pod 已綁定到節點，所有容器都已創建
3. **Succeeded**: Pod 中的所有容器都已成功終止
4. **Failed**: Pod 中至少有一個容器以非零狀態終止
5. **Unknown**: 由於某些原因，Pod 的狀態無法獲取

## Pod 的網絡
- 每個 Pod 都有自己的 IP 地址
- Pod 內的容器共享網絡命名空間
- 容器間可以通過 localhost 通信

## Pod 的存儲
- Pod 可以指定共享的存儲卷
- 即使容器重啟，存儲卷中的數據也會保留
- 支持多種存儲類型：emptyDir、hostPath、NFS 等 