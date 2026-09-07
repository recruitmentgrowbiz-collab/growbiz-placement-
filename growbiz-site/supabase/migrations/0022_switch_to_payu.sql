-- ============================================================================
-- Grow Biz Jobs — Switch Payment Gateway: Razorpay → PayU
-- The payments table (0005_payments.sql) had Razorpay-specific column names
-- baked in. Renaming to provider-generic names since the app is switching
-- gateways entirely — cleaner than leaving Razorpay-named columns storing
-- PayU data, or bolting on a second set of parallel columns.
-- Run this AFTER 0001-0021.
-- ============================================================================

alter table public.payments rename column razorpay_order_id to provider_order_id;
alter table public.payments rename column razorpay_payment_id to provider_payment_id;
