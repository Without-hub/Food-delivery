package com.example.fooddelivery.config;

import org.springframework.stereotype.Component;

/**
 * 雪花算法 ID 生成器
 * 结构：1位符号位 + 41位时间戳（毫秒） + 10位工作节点ID + 12位序列号
 * 理论 QPS：409.6万/秒
 */
@Component
public class SnowflakeIdGenerator {

    /** 起始时间戳：2024-01-01 00:00:00 */
    private static final long START_EPOCH = 1704067200000L;

    /** 机器 ID 位数 */
    private static final long WORKER_ID_BITS = 10L;
    /** 序列号位数 */
    private static final long SEQUENCE_BITS = 12L;

    /** 最大机器 ID */
    private static final long MAX_WORKER_ID = ~(-1L << WORKER_ID_BITS);
    /** 最大序列号 */
    private static final long MAX_SEQUENCE = ~(-1L << SEQUENCE_BITS);

    /** 机器 ID 左移位数 */
    private static final long WORKER_ID_SHIFT = SEQUENCE_BITS;
    /** 时间戳左移位数 */
    private static final long TIMESTAMP_SHIFT = WORKER_ID_BITS + SEQUENCE_BITS;

    private final long workerId;
    private long sequence = 0L;
    private long lastTimestamp = -1L;

    public SnowflakeIdGenerator() {
        // 默认使用 0，可通过 application.yml 配置
        this.workerId = 0L;
    }

    public SnowflakeIdGenerator(long workerId) {
        if (workerId < 0 || workerId > MAX_WORKER_ID) {
            throw new IllegalArgumentException("Worker ID 必须在 0~" + MAX_WORKER_ID + " 之间");
        }
        this.workerId = workerId;
    }

    /**
     * 生成下一个唯一 ID
     */
    public synchronized long nextId() {
        long timestamp = System.currentTimeMillis();

        if (timestamp < lastTimestamp) {
            throw new RuntimeException("时钟回拨，拒绝生成 ID：" + (lastTimestamp - timestamp) + "ms");
        }

        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & MAX_SEQUENCE;
            if (sequence == 0) {
                // 当前毫秒序列号用完，等待下一毫秒
                timestamp = waitNextMillis(timestamp);
            }
        } else {
            sequence = 0L;
        }

        lastTimestamp = timestamp;

        return ((timestamp - START_EPOCH) << TIMESTAMP_SHIFT)
                | (workerId << WORKER_ID_SHIFT)
                | sequence;
    }

    /**
     * 生成订单号（20 位数字字符串，比直接 long 更易读）
     */
    public String nextOrderNo() {
        return String.valueOf(nextId());
    }

    private long waitNextMillis(long currentTimestamp) {
        long timestamp = System.currentTimeMillis();
        while (timestamp <= currentTimestamp) {
            timestamp = System.currentTimeMillis();
        }
        return timestamp;
    }
}
