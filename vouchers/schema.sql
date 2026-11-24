CREATE TABLE IF NOT EXISTS vouchers (
  checkout_id text PRIMARY KEY,
  payment_intent text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  offer_id text NOT NULL,
  intro_count integer NOT NULL CHECK (intro_count >= 0),
  standard_count integer NOT NULL CHECK (standard_count >= 0),
  issued_at timestamptz NOT NULL,
  valid_through date NOT NULL,
  delivery_started_at timestamptz NOT NULL DEFAULT now(),
  delivery_id text
);

CREATE TABLE IF NOT EXISTS voucher_refunds (
  payment_intent text PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS voucher_redemptions (
  booking_id text PRIMARY KEY,
  code text NOT NULL REFERENCES vouchers (code),
  session_type text NOT NULL CHECK (session_type IN ('kennenlernen', 'sitzung'))
);

-- Run before manually confirming a new Cal.com request.
CREATE OR REPLACE FUNCTION reserve_voucher_session(v_code text, v_session text, v_booking text)
RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE
  voucher vouchers%ROWTYPE;
  allowance integer;
BEGIN
  SELECT * INTO voucher FROM vouchers WHERE code = v_code FOR UPDATE;
  IF NOT FOUND OR voucher.valid_through < (now() AT TIME ZONE 'Europe/Berlin')::date
    OR EXISTS (SELECT 1 FROM voucher_refunds WHERE payment_intent = voucher.payment_intent)
    THEN RETURN false;
  END IF;
  IF EXISTS (SELECT 1 FROM voucher_redemptions WHERE booking_id = v_booking) THEN
    RETURN EXISTS (SELECT 1 FROM voucher_redemptions WHERE booking_id = v_booking AND code = v_code AND session_type = v_session);
  END IF;
  allowance := CASE v_session WHEN 'kennenlernen' THEN voucher.intro_count WHEN 'sitzung' THEN voucher.standard_count ELSE 0 END;
  IF (SELECT count(*) FROM voucher_redemptions WHERE code = v_code AND session_type = v_session) >= allowance
    THEN RETURN false;
  END IF;
  INSERT INTO voucher_redemptions (booking_id, code, session_type)
    VALUES (v_booking, v_code, v_session) ON CONFLICT DO NOTHING;
  RETURN FOUND;
END;
$$;
