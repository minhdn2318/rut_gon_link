
# 🔗 Hệ Thống Rút Gọn Link - ReactJS + NestJS CQRS

## 🧩 Tổng quan

Đây là hệ thống rút gọn URL của nhóm 1, môn Kiến trúc phần mềm hiện đại (mã học phần: 2425II_INT6017), Trường Đại học Quốc gia Hà Nội. Hệ thống được xây dựng dựa trên kiến trúc **CQRS (Command Query Responsibility Segregation)** – tách biệt rõ ràng giữa các thao tác ghi và đọc dữ liệu – nhằm tăng tính mở rộng và hiệu quả xử lý. Ngoài ra, hệ thống còn sử dụng **Redis** làm bộ nhớ đệm (**cache**) giúp tăng tốc độ phản hồi các truy vấn thường xuyên, giảm tải cho cơ sở dữ liệu, và nâng cao hiệu năng tổng thể. Hệ thống sử dụng:

- **Frontend**: ReactJS
- **Backend**: NestJS
- **Cache**: Redis (`cache-manager`)
- **Database**: MongoDB
- **Triển khai**: Docker
- **Hiệu năng**: Kiểm thử bằng JMeter cho kết quả tăng 10 lần sau khi tối ưu.

---

## ⚙️ Kiến trúc hệ thống

- `Command`: Ghi dữ liệu vào MongoDB (tạo URL, xóa URL, cập nhật).
- `Query`: Đọc dữ liệu từ Redis (ưu tiên cache), nếu không có thì fallback MongoDB.
- **Redis cache** giúp giảm tải database và tăng tốc độ truy xuất link gốc.

---

## 🛠 Cài đặt & Khởi động

### 1. Cài đặt gói phụ thuộc

```bash
$ npm install
```

### 2. Khởi động ứng dụng

```bash
# Chạy ở chế độ development
$ npm run start

# Chạy ở chế độ watch mode
$ npm run start:dev

# Chạy ở chế độ production
$ npm run start:prod
```

---

## ✅ Kiểm thử

```bash
# Kiểm thử đơn vị (unit test)
$ npm run test

# Kiểm thử đầu cuối (e2e test)
$ npm run test:e2e

# Kiểm tra độ bao phủ mã nguồn
$ npm run test:cov
```

---

## 🧪 Kiểm thử hiệu năng với JMeter

### ⚡ Thử nghiệm tải bằng JMeter

- Kịch bản: Gửi yêu cầu POST để rút gọn link với 100 người dùng đồng thời.
- Hạ tầng: 
  - Redis server chạy với PID `44711` - sử dụng ~0.3% RAM
  - Tổng RAM sử dụng: ~1.14GB/1.92GB
  - Hệ thống trung bình tải chỉ ~0.2

### 📉 Kết quả bản base (chưa tối ưu)

![Hiệu năng bản base](test tải/response-time-100CCU.png)

- **Thời gian phản hồi trung bình**: ~2.000–4.000ms
- **Có nhiều spike lên tới 8.000–12.000ms**
- **Không phù hợp cho hệ thống lớn**

---

## 🚀 Sau khi áp dụng CQRS + Redis cache

- **Thời gian phản hồi giảm xuống còn ~200–300ms**
- **Tốc độ tăng gấp 10 lần** so với bản cũ
- **Không có spike lớn** khi tăng tải
- **Tận dụng cache Redis hiệu quả giúp giảm thiểu đọc từ DB**
- kết quả kiểm thử để trong folder **test_performance**
---

## 📦 Triển khai với Docker 

```bash
# Build Docker image
$ docker build -t url-shortener .

# Chạy container
$ docker run -p 3000:3000 url-shortener
```

> Hệ thống có thể dễ dàng mở rộng ngang bằng cách thêm replica backend, sử dụng Redis cluster nếu cần.

---

## ☁ Triển khai lên cloud (tùy chọn)

> Nếu bạn cần triển khai ứng dụng NestJS lên AWS một cách dễ dàng, hãy thử **[Mau](https://mau.nestjs.com)**:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

---

## 📚 Tài liệu tham khảo

- [NestJS CQRS Module](https://docs.nestjs.com/recipes/cqrs)
- [Cache Manager Redis](https://www.npmjs.com/package/cache-manager-ioredis)
- [JMeter CLI Testing](https://jmeter.apache.org/usermanual/)
