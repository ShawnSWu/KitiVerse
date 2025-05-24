## 又可稱作 Ingress Resource，它『只定義』路由規則，它本身並不會直接處理流量( 他是抽象的)。  
## 它只是告訴 Kubernetes：「當有流量進來時，根據這些規則將流量轉發到 ingressClassName: XXX 的Ingress controller上
### 作用
- 讓 **外部使用者** 可以透過 **域名 (URL) + 路由** 訪問 Kubernetes 內部的 Service。
- 允許**一個 IP (Ingress) 負責多個 Service**，類似反向代理。
- 支持**HTTPS、流量轉發、負載均衡、Rewrite** 等功能。

#### 主要特性
- **路由規則**：根據域名或路徑將流量導向不同服務。
- **負載均衡**：整合外部負載均衡器（如 Nginx、Traefik）。
- **SSL 支援**：通過 TLS 配置實現安全通信。
## 基本範例
```yaml=
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
          - path: /web
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
    - host: admin.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: admin-service
                port:
                  number: 80

```

### **🔹 上面例子的路由規則說明**

1. **第一個 Host (`myapp.example.com`)**
    
    - `/api` → 轉發到 **`api-service`**
    - `/web` → 轉發到 **`web-service`**
2. **第二個 Host (`admin.example.com`)**
    
    - `/` (根路徑) → 轉發到 **`admin-service`**