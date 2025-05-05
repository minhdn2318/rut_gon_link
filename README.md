# 🔗 Hệ Thống Rút Gọn Link - ReactJS + NestJS CQRS

## 📋 Mục lục
1. [🧩 Tổng quan](#-tổng-quan)
2. [⚙️ Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
3. [🛠 Cài đặt & Khởi động](#-cài-đặt--khởi-động)
4. [✅ Kiểm thử](#-kiểm-thử)
5. [🧪 Kiểm thử hiệu năng với JMeter](#-kiểm-thử-hiệu-năng-với-jmeter)
6. [📦 Triển khai với Docker](#-triển-khai-với-docker)
7. [☁ Triển khai lên cloud (tùy chọn)](#-triển-khai-lên-cloud-tùy-chọn)
8. [📐 Các mẫu thiết kế](#-các-mẫu-thiết-kế)
9. [📚 Tài liệu tham khảo](#-tài-liệu-tham-khảo)

## 🧩 Tổng quan
Hệ thống rút gọn URL xây dựng dựa trên kiến trúc **CQRS (Command Query Responsibility Segregation)** và **Redis cache**, giúp tăng tốc độ phản hồi và hiệu năng.

## ⚙️ Kiến trúc hệ thống
- `Command`: Thao tác ghi với MongoDB.
- `Query`: Đọc từ Redis, fallback MongoDB.
- **Redis cache**: Tăng tốc đọc, giảm tải database.

## 🛠 Cài đặt & Khởi động
### 1. Cài đặt gói phụ thuộc
```bash
npm install
```

### 2. Khởi động ứng dụng
```bash
npm run start        # development
npm run start:dev    # watch mode
npm run start:prod   # production
```

## ✅ Kiểm thử
```bash
npm run test         # unit test
npm run test:e2e     # end-to-end test
npm run test:cov     # coverage
```

## 🧪 Kiểm thử hiệu năng với JMeter
### ⚡ Thử nghiệm tải:
- Gửi POST với các ngưỡng 100, 200, 400, 1000 người dùng đồng thời (CCU).
- Redis ~0.3% RAM | Tổng RAM ~1.14GB/1.92GB | Load ~0.2

### 🖥 Cấu hình hệ thống test

- Máy ảo KVM

- RAM: 2GB (sử dụng ~1.14GB khi test)

- CPU: 2 vCPU

- Disk: SSD 40GB

- Network Interface: eth0 (MTU 1500), không xác định tốc độ do giới hạn ảo hóa (ethtool không trả về speed)

- OS: Ubuntu 24.04 LTS

### 📉 Kết quả bản base:

- ![Hiệu năng bản base](test tải/response-time-100CCU.png)

- Phản hồi trung bình: 2.000–4.000ms

- Spike cao: 8.000–12.000ms

- Ngưỡng chịu tải: ~80 request/s

### 🚀 Sau tối ưu CQRS + Redis:

- Phản hồi: ~200–300ms

- Tăng hiệu suất ~8 lần

- Không còn spike lớn

- Ngưỡng chịu tải mới: ~500 request/s

## 📦 Triển khai với Docker
```bash
docker build -t url-shortener .
docker run -p 3000:3000 url-shortener
```
> Có thể mở rộng ngang bằng cách scale backend, dùng Redis cluster.

## ☁ Triển khai lên cloud (tùy chọn)
```bash
npm install -g @nestjs/mau
mau deploy
```

## 📐 Các mẫu thiết kế
Workflow khi thêm các architecture pattern
![alt text](<Url-Shortener Workflow.png>)

### ✅ CQRS (Command & Query Responsibility Segregation)
- Tách rõ ghi và đọc => tối ưu hoá xử lý.

### 🧠 Caching (Redis)
- Truy vấn đọc từ Redis trước, tăng tốc độ và giảm tải MongoDB.

### 🔃 Rate Limiting (Giới hạn tần suất truy cập)
- Tránh abuse hệ thống (ví dụ spam POST link).
- Thường dùng middleware (VD: `nestjs-rate-limiter`, `express-rate-limit`).

### 🛡 Circuit Breaker (Ngắt mạch)
- Bảo vệ hệ thống khỏi việc gọi tới dịch vụ lỗi liên tục.
- Nếu MongoDB/Redis gặp lỗi, ngắt mạch tạm thời, chờ phục hồi rồi thử lại.
- Có thể tích hợp `@nestjs/terminus` hoặc dùng thư viện như `opossum`.

## 📚 Tài liệu tham khảo
- [NestJS CQRS Module](https://docs.nestjs.com/recipes/cqrs)
- [Cache Manager Redis](https://www.npmjs.com/package/cache-manager-ioredis)
- [JMeter CLI Testing](https://jmeter.apache.org/usermanual/)
- [Rate Limiter for Express](https://www.npmjs.com/package/express-rate-limit)
- [Circuit Breaker with Opossum](https://nodeshift.dev/opossum/)
