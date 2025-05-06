# 🔗 Hệ Thống Rút Gọn Link - ReactJS + NestJS CQRS

## 📋 Mục lục
1. [🧩 Tổng quan](#-tổng-quan)
2. [🌐 Web triển khai demo](#-Web-triển-khai-demo)
3. [⚙️ Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
4. [🛠 Cài đặt & Khởi động](#-cài-đặt--khởi-động)
5. [✅ Kiểm thử](#-kiểm-thử)
6. [🧪 Kiểm thử hiệu năng với JMeter](#-kiểm-thử-hiệu-năng-với-jmeter)
7. [📦 Triển khai với Docker](#-triển-khai-với-docker)
8. [☁ Triển khai lên cloud (tùy chọn)](#-triển-khai-lên-cloud-tùy-chọn)
9. [📐 Các mẫu thiết kế](#-các-mẫu-thiết-kế)
10. [📚 Tài liệu tham khảo](#-tài-liệu-tham-khảo)

## 🧩 Tổng quan
Hệ thống rút gọn URL xây dựng dựa trên kiến trúc **CQRS (Command Query Responsibility Segregation)** và **Redis cache**, giúp tăng tốc độ phản hồi và hiệu năng.

## 🌐 Web triển khai demo
Truy cập bản chạy demo web tại địa chỉ: [http://riot360.net:4000/](http://riot360.net:4000/)

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

- Network Interface: eth0 (MTU 1500), ước lượng tốc độ ~250 Mb/s do giới hạn trong môi trường ảo hóa

- OS: Ubuntu 24.04 LTS

### 📉 Kết quả bản base:

- ![Hiệu năng bản base](test tải/response-time-100CCU.png)

- Phản hồi trung bình: 6.000ms

- Spike cao: 70.000ms

- Ngưỡng chịu tải: ~80 request/s

### 🚀 Sau tối ưu CQRS + Redis:

- Phản hồi: ~1700 ms

- Tăng hiệu suất ~8 lần

- Không còn spike lớn

- Ngưỡng chịu tải mới: ~600 request/s

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
- Bảo vệ hệ thống khỏi các cuộc tấn công DDoS bằng cách giới hạn số lượng request.
- Cải thiện hiệu suất bằng cách ngăn chặn quá tải tài nguyên.
- Sử dụng thư viện ThrottlerModule để giới hạn request đến Client.

### 🛡 Circuit Breaker (Ngắt mạch)
- Bảo vệ hệ thống khỏi việc gọi tới dịch vụ lỗi liên tục.
- Nếu MongoDB/Redis gặp lỗi, ngắt mạch tạm thời, chờ phục hồi rồi thử lại.
- Trong dự án đang sử dụng thư viện như `opossum` và chỉ ngắt dịch vụ khi chúng trả về mã lỗi 500.

### 🔗 Sharding pattern (Option mở rộng)
- Cải thiện hiệu suất: Phân chia dữ liệu thành nhiều Shard, hệ thống có thể thực hiện các truy vấn song song, giảm tải cho từng máy chủ và tăng tốc độ xử lý.
- Tăng tính sẵn sàng và khả năng chịu lỗi: Nếu một shard gặp sự cố, hệ thống vẫn có thể hoạt động với các shard còn lại, giảm nguy cơ gián đoạn dịch vụ.
- Tăng khả năng mở rộng: Thay vì lưu trữ tất cả dữ liệu trên một máy chủ duy nhất, Sharding Pattern cho phép phân bổ dữ liệu trên nhiều máy chủ, giúp mở rộng hệ thống một cách linh hoạt.
Tuy nhiên, do cấu hình máy chủ thử nghiệm không đáp ứng được vì vậy nhóm đã để pattern này làm 1 option khi cần mở rộng hệ thống.

## 📚 Tài liệu tham khảo
- [NestJS CQRS Module](https://docs.nestjs.com/recipes/cqrs)
- [Cache Manager Redis](https://www.npmjs.com/package/cache-manager-ioredis)
- [JMeter CLI Testing](https://jmeter.apache.org/usermanual/)
- [Rate Limiter for Express](https://www.npmjs.com/package/express-rate-limit)
- [Circuit Breaker with Opossum](https://nodeshift.dev/opossum/)
