CREATE TABLE IF NOT EXISTS orbit_profiles (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 phone TEXT NOT NULL DEFAULT '',
 role TEXT NOT NULL DEFAULT 'rider' CHECK(role IN ('rider','driver')),
 avatar TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS orbit_rides (
 id TEXT PRIMARY KEY,
 rider_id TEXT NOT NULL REFERENCES orbit_profiles(id),
 driver_id TEXT REFERENCES orbit_profiles(id),
 pickup TEXT NOT NULL,
 destination TEXT NOT NULL,
 type TEXT NOT NULL CHECK(type IN ('go','comfort','xl')),
 fare INTEGER NOT NULL CHECK(fare>0),
 distance DOUBLE PRECISION NOT NULL CHECK(distance>0),
 status TEXT NOT NULL DEFAULT 'requested' CHECK(status IN ('requested','accepted','arrived','in_progress','completed','cancelled')),
 created TEXT NOT NULL,
 rating INTEGER CHECK(rating BETWEEN 1 AND 5),
 review TEXT,
 payment TEXT NOT NULL DEFAULT 'cash',
 paid INTEGER NOT NULL DEFAULT 0 CHECK(paid IN (0,1)),
 CHECK(pickup<>destination),
 CHECK(driver_id IS NULL OR driver_id<>rider_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS orbit_active_rider ON orbit_rides(rider_id) WHERE status NOT IN ('completed','cancelled');
CREATE UNIQUE INDEX IF NOT EXISTS orbit_active_driver ON orbit_rides(driver_id) WHERE driver_id IS NOT NULL AND status NOT IN ('completed','cancelled');
CREATE INDEX IF NOT EXISTS orbit_ride_created ON orbit_rides(created DESC);
