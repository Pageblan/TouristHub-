-- Location: supabase/migrations/20250915085918_tourism_complete.sql
-- Schema Analysis: Fresh project with no existing schema
-- Integration Type: NEW_MODULE - Complete tourism system
-- Dependencies: None - creating complete schema

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'agent', 'tourist');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.accommodation_type AS ENUM ('hotel', 'resort', 'villa', 'apartment', 'hostel');
CREATE TYPE public.destination_type AS ENUM ('beach', 'mountain', 'city', 'cultural', 'adventure', 'wildlife');

-- 2. Core User Table (Auth Intermediary)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'tourist'::public.user_role,
    profile_image TEXT,
    nationality TEXT,
    date_of_birth DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Destinations Table
CREATE TABLE public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT,
    region TEXT,
    destination_type public.destination_type DEFAULT 'city'::public.destination_type,
    description TEXT NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    image_url TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    weather_info JSONB,
    activities TEXT[] DEFAULT ARRAY[]::TEXT[],
    best_time_to_visit TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tour Packages Table
CREATE TABLE public.tour_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price_per_person DECIMAL(10,2) NOT NULL,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    duration_days INTEGER NOT NULL,
    max_capacity INTEGER DEFAULT 20,
    accommodation_type public.accommodation_type DEFAULT 'hotel'::public.accommodation_type,
    includes TEXT[] DEFAULT ARRAY[]::TEXT[],
    excludes TEXT[] DEFAULT ARRAY[]::TEXT[],
    itinerary JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    special_offers TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bookings Table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    tour_package_id UUID REFERENCES public.tour_packages(id) ON DELETE CASCADE,
    booking_reference TEXT NOT NULL UNIQUE,
    total_travelers INTEGER NOT NULL DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    return_date DATE,
    status public.booking_status DEFAULT 'pending'::public.booking_status,
    traveler_details JSONB DEFAULT '{}'::jsonb,
    special_requests TEXT,
    payment_status TEXT DEFAULT 'pending',
    payment_id TEXT,
    notes TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Reviews Table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    tour_package_id UUID REFERENCES public.tour_packages(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Wishlist Table
CREATE TABLE public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    tour_package_id UUID REFERENCES public.tour_packages(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tour_package_id)
);

-- 8. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_destinations_country ON public.destinations(country);
CREATE INDEX idx_destinations_type ON public.destinations(destination_type);
CREATE INDEX idx_destinations_featured ON public.destinations(is_featured) WHERE is_featured = true;
CREATE INDEX idx_tour_packages_destination_id ON public.tour_packages(destination_id);
CREATE INDEX idx_tour_packages_price ON public.tour_packages(price_per_person);
CREATE INDEX idx_tour_packages_featured ON public.tour_packages(is_featured) WHERE is_featured = true;
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_dates ON public.bookings(departure_date, return_date);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_tour_package_id ON public.reviews(tour_package_id);
CREATE INDEX idx_wishlists_user_id ON public.wishlists(user_id);

-- 9. Functions (BEFORE RLS Policies)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'tourist'::public.user_role)
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    ref TEXT;
BEGIN
    ref := 'TH' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN ref;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 10. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies using Pattern System
-- Pattern 1: Core User Table (user_profiles)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public Read, Private Write (destinations)
CREATE POLICY "public_can_read_destinations"
ON public.destinations
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "admins_manage_destinations"
ON public.destinations
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin' 
             OR au.raw_app_meta_data->>'role' = 'admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin' 
             OR au.raw_app_meta_data->>'role' = 'admin')
    )
);

-- Pattern 4: Public Read, Private Write (tour_packages)
CREATE POLICY "public_can_read_tour_packages"
ON public.tour_packages
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "admins_manage_tour_packages"
ON public.tour_packages
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin' 
             OR au.raw_app_meta_data->>'role' = 'admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin' 
             OR au.raw_app_meta_data->>'role' = 'admin')
    )
);

-- Pattern 2: Simple User Ownership (bookings)
CREATE POLICY "users_manage_own_bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Simple User Ownership (reviews)
CREATE POLICY "users_manage_own_reviews"
ON public.reviews
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public read for reviews
CREATE POLICY "public_can_read_reviews"
ON public.reviews
FOR SELECT
TO public
USING (true);

-- Pattern 2: Simple User Ownership (wishlists)
CREATE POLICY "users_manage_own_wishlists"
ON public.wishlists
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 12. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at
    BEFORE UPDATE ON public.destinations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tour_packages_updated_at
    BEFORE UPDATE ON public.tour_packages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    agent_uuid UUID := gen_random_uuid();
    tourist_uuid UUID := gen_random_uuid();
    dest_greece UUID := gen_random_uuid();
    dest_bali UUID := gen_random_uuid();
    dest_alps UUID := gen_random_uuid();
    dest_tokyo UUID := gen_random_uuid();
    dest_maldives UUID := gen_random_uuid();
    dest_paris UUID := gen_random_uuid();
    package1_id UUID := gen_random_uuid();
    package2_id UUID := gen_random_uuid();
    package3_id UUID := gen_random_uuid();
    booking1_id UUID := gen_random_uuid();
    booking2_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@tourismhub.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Tourism Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (agent_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'agent@tourismhub.com', crypt('agent123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Travel Agent", "role": "agent"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (tourist_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'tourist@example.com', crypt('tourist123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Tourist", "role": "tourist"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create destinations
    INSERT INTO public.destinations (id, name, country, city, destination_type, description, latitude, longitude, image_url, activities, is_featured, is_active) VALUES
        (dest_greece, 'Santorini', 'Greece', 'Oia', 'beach'::public.destination_type, 
         'Experience the breathtaking sunsets and white-washed buildings of this iconic Greek island paradise.', 
         36.3932, 25.4615, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&h=300&fit=crop',
         ARRAY['Sunset Viewing', 'Wine Tasting', 'Beach Relaxation', 'Photography'], true, true),
        (dest_bali, 'Bali', 'Indonesia', 'Ubud', 'cultural'::public.destination_type,
         'Discover the perfect blend of culture, spirituality, and natural beauty in this tropical paradise.',
         -8.3405, 115.0920, 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500&h=300&fit=crop',
         ARRAY['Temple Visits', 'Surfing', 'Yoga Retreats', 'Rice Terrace Tours'], true, true),
        (dest_alps, 'Swiss Alps', 'Switzerland', 'Zermatt', 'mountain'::public.destination_type,
         'Adventure awaits in the majestic peaks with world-class skiing, hiking, and mountain experiences.',
         46.5197, 7.4815, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
         ARRAY['Skiing', 'Hiking', 'Mountain Climbing', 'Cable Car Rides'], true, true),
        (dest_tokyo, 'Tokyo', 'Japan', 'Tokyo', 'city'::public.destination_type,
         'Immerse yourself in the vibrant culture where ancient traditions meet cutting-edge modernity.',
         35.6762, 139.6503, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop',
         ARRAY['Cultural Tours', 'Food Experiences', 'Shopping', 'Temple Visits'], true, true),
        (dest_maldives, 'Maldives', 'Maldives', 'Male', 'beach'::public.destination_type,
         'Luxury overwater villas and pristine beaches create the ultimate romantic getaway destination.',
         3.2028, 73.2207, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
         ARRAY['Snorkeling', 'Diving', 'Spa Treatments', 'Water Sports'], true, true),
        (dest_paris, 'Paris', 'France', 'Paris', 'city'::public.destination_type,
         'The City of Light offers romance, art, cuisine, and iconic landmarks in every charming corner.',
         48.8566, 2.3522, 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=500&h=300&fit=crop',
         ARRAY['Museum Tours', 'Seine Cruises', 'Culinary Experiences', 'Shopping'], true, true);

    -- Create tour packages
    INSERT INTO public.tour_packages (id, destination_id, title, description, price_per_person, min_price, max_price, duration_days, accommodation_type, includes, is_featured) VALUES
        (package1_id, dest_greece, 'Santorini Sunset Paradise', 
         'Experience the magic of Santorini with luxury accommodations, wine tastings, and unforgettable sunsets.',
         1850.00, 1200.00, 2500.00, 5, 'resort'::public.accommodation_type,
         ARRAY['Luxury Resort Stay', 'All Meals', 'Wine Tasting Tour', 'Sunset Cruise', 'Airport Transfers'], true),
        (package2_id, dest_bali, 'Bali Cultural Journey',
         'Immerse yourself in Balinese culture with temple visits, yoga sessions, and traditional experiences.',
         1300.00, 800.00, 1800.00, 7, 'villa'::public.accommodation_type,
         ARRAY['Villa Accommodation', 'Daily Breakfast', 'Temple Tours', 'Yoga Classes', 'Cultural Workshops'], true),
        (package3_id, dest_alps, 'Swiss Alps Adventure',
         'Mountain adventure with skiing, hiking, and breathtaking Alpine scenery.',
         3250.00, 2000.00, 4500.00, 6, 'hotel'::public.accommodation_type,
         ARRAY['Mountain Hotel Stay', 'All Meals', 'Ski Passes', 'Cable Car Access', 'Equipment Rental'], true);

    -- Create sample bookings
    INSERT INTO public.bookings (id, user_id, tour_package_id, booking_reference, total_travelers, total_amount, booking_date, departure_date, return_date, status) VALUES
        (booking1_id, tourist_uuid, package1_id, public.generate_booking_reference(), 2, 3700.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE + INTERVAL '35 days', 'confirmed'::public.booking_status),
        (booking2_id, tourist_uuid, package2_id, public.generate_booking_reference(), 1, 1300.00, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '60 days', CURRENT_DATE + INTERVAL '67 days', 'pending'::public.booking_status);

    -- Create sample reviews
    INSERT INTO public.reviews (user_id, tour_package_id, destination_id, booking_id, rating, title, content) VALUES
        (tourist_uuid, package1_id, dest_greece, booking1_id, 5, 'Absolutely Amazing Experience!', 
         'The Santorini tour exceeded all expectations. The sunsets were breathtaking and the accommodation was luxurious.'),
        (tourist_uuid, package2_id, dest_bali, null, 4, 'Great Cultural Experience', 
         'Loved the temple visits and yoga classes. Very authentic and well organized.');

    -- Create wishlist items
    INSERT INTO public.wishlists (user_id, tour_package_id) VALUES
        (tourist_uuid, package3_id);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;