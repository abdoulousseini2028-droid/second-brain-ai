# System Design — Chat Service

## Introduction
Chat services need to handle millions of users sending messages in real-time.

## Key Components
- Message Queue: For asynchronous processing.
- Database: Sharded for scalability.
- Load Balancer: To distribute traffic.

## Tradeoffs
Scalability vs Consistency: In chat, eventual consistency is often acceptable to ensure availability.