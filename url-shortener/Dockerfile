# Sử dụng Node.js image chính thức

FROM node:20-alpine

# Tạo thư mục làm việc

WORKDIR /app

# Copy package.json

COPY package.json ./

# Copy package-lock.json nếu tồn tại (tùy chọn)

COPY package-lock.json ./

# Cài dependencies

RUN npm install

# Copy toàn bộ source code

COPY . .

# Build ứng dụng
RUN npm run build

ENV NODE_ENV=production

# Mở port 5000

EXPOSE 5000

# Chạy ứng dụng

CMD ["npm", "run", "start"]