#!/bin/bash

# ==========================
# Script khởi tạo MongoDB Sharded Cluster
# ==========================

# 🔁 Đợi mongos khởi động (nếu cần)
echo "⏳ Chờ mongos sẵn sàng..."
until mongosh --host mongos:27017 --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  sleep 2
  echo "⏳ Đợi mongos..."
done
echo "✅ Mongos sẵn sàng!"

# 🧱 1. Khởi tạo config server replica set
echo "🚀 Khởi tạo config server replicaset..."
mongosh --host config1:27019 <<EOF
rs.initiate({
  _id: "cfgRS",
  configsvr: true,
  members: [
    { _id: 0, host: "config1:27019" },
    { _id: 1, host: "config2:27019" },
    { _id: 2, host: "config3:27019" }
  ]
})
EOF

# 💤 Đợi config replicaset ổn định
sleep 5

# 🧱 2. Khởi tạo shard1 replica set
echo "🚀 Khởi tạo shard1 replicaset..."
mongosh --host shard1a:27018 <<EOF
rs.initiate({
  _id: "shard1RS",
  members: [
    { _id: 0, host: "shard1a:27018" },
    { _id: 1, host: "shard1b:27018" },
    { _id: 2, host: "shard1c:27018" }
  ]
})
EOF

# 🧱 3. Khởi tạo shard2 replica set
echo "🚀 Khởi tạo shard2 replicaset..."
mongosh --host shard2a:27018 <<EOF
rs.initiate({
  _id: "shard2RS",
  members: [
    { _id: 0, host: "shard2a:27018" },
    { _id: 1, host: "shard2b:27018" },
    { _id: 2, host: "shard2c:27018" }
  ]
})
EOF

# 💤 Đợi các shard ổn định
sleep 5

# 🔗 4. Kết nối mongos và add shards
echo "🔗 Thêm shards vào cluster qua mongos..."
mongosh --host mongos:27017 <<EOF
sh.addShard("shard1RS/shard1a:27018,shard1b:27018,shard1c:27018")
sh.addShard("shard2RS/shard2a:27018,shard2b:27018,shard2c:27018")
EOF

# 📦 5. Tạo database và bật sharding
echo "📦 Tạo database 'shortener' và bật sharding..."
mongosh --host mongos:27017 <<EOF
sh.enableSharding("shortener")
sh.shardCollection("shortener.urls", { shortCode: "hashed" })
EOF

echo "✅ Cấu hình cluster hoàn tất!"
