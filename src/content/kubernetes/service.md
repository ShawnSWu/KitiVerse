# Kubernetes Service

## 什麼是 Service？
Service 是 Kubernetes 中定義了一組 Pod 的抽象方式，並提供了一個穩定的網絡端點來訪問這些 Pod。

## Service 的類型
1. **ClusterIP**（默認）
   - 在集群內部提供服務
   - 分配一個集群內部的 IP 地址
   - 只能在集群內部訪問

2. **NodePort**
   - 在每個節點上開放一個端口
   - 可以通過 `NodeIP:NodePort` 從集群外部訪問
   - 端口範圍：30000-32767

3. **LoadBalancer**
   - 使用雲服務商的負載均衡器
   - 自動分配外部 IP 地址
   - 適合雲環境使用

4. **ExternalName**
   - 將服務映射到外部域名
   - 不創建任何代理
   - 返回 CNAME 記錄

## Service 的選擇器
- 使用標籤選擇器（Label Selector）來選擇 Pod
- 只有標籤匹配的 Pod 才會被包含在服務中
- 支持多個標籤條件 