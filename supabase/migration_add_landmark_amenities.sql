-- ============================================
-- Estate Reserve — Schema Migration
-- Add landmark and amenities columns to properties
-- ============================================
-- Run this SQL in the Supabase SQL Editor

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS landmark TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS amenities TEXT[] NOT NULL DEFAULT '{}';
