-- Insert sample events (using a demo organizer ID that will be created on first signup)
-- Note: These events will be visible to everyone due to the public read policy
-- The organizer_id will need to match a real user after signup

-- First, let's create a function to seed sample events after first organizer signup
CREATE OR REPLACE FUNCTION public.seed_sample_events(organizer_uuid UUID, organizer_name_param TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only seed if no events exist yet
  IF NOT EXISTS (SELECT 1 FROM public.events LIMIT 1) THEN
    INSERT INTO public.events (title, description, category, image_url, date, time, end_time, venue, city, address, price, total_tickets, tickets_sold, organizer_id, organizer_name, organizer_verified, is_featured, is_trending, status) VALUES
    ('Techfest 2026', 'The biggest technical festival in Mumbai featuring robotics, coding competitions, and tech talks from industry leaders.', 'college-fest', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', CURRENT_DATE + INTERVAL '7 days', '10:00 AM', '8:00 PM', 'IIT Bombay', 'Mumbai', 'Powai, Mumbai, Maharashtra', 299, 500, 342, organizer_uuid, organizer_name_param, true, true, true, 'active'),
    ('Acoustic Night', 'An intimate evening of acoustic performances by indie artists in a cozy café setting.', 'music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', CURRENT_DATE + INTERVAL '3 days', '7:00 PM', '11:00 PM', 'The Piano Man Jazz Club', 'Delhi', 'Safdarjung, New Delhi', 499, 100, 78, organizer_uuid, organizer_name_param, true, false, true, 'active'),
    ('Startup Pitch Workshop', 'Learn how to pitch your startup idea to investors. Includes mock pitching sessions and feedback.', 'workshop', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', CURRENT_DATE + INTERVAL '5 days', '2:00 PM', '6:00 PM', 'WeWork Galaxy', 'Bangalore', 'Residency Road, Bangalore', 199, 50, 35, organizer_uuid, organizer_name_param, false, true, false, 'active'),
    ('Stand-up Comedy Night', 'An evening of laughter with some of the best stand-up comedians in the country.', 'comedy', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800', CURRENT_DATE + INTERVAL '2 days', '8:00 PM', '10:30 PM', 'Canvas Laugh Club', 'Mumbai', 'Lower Parel, Mumbai', 599, 200, 156, organizer_uuid, organizer_name_param, true, false, true, 'active'),
    ('Food & Music Festival', 'A weekend celebration of local cuisine and live music performances from regional artists.', 'food', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', CURRENT_DATE + INTERVAL '10 days', '11:00 AM', '10:00 PM', 'Jawaharlal Nehru Stadium', 'Delhi', 'Lodhi Road, New Delhi', 149, 1000, 623, organizer_uuid, organizer_name_param, true, true, true, 'active'),
    ('UI/UX Design Bootcamp', 'Intensive 2-day workshop covering Figma, design systems, and user research methods.', 'workshop', 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800', CURRENT_DATE + INTERVAL '14 days', '9:00 AM', '5:00 PM', 'Design Studio', 'Bangalore', 'Koramangala, Bangalore', 999, 30, 24, organizer_uuid, organizer_name_param, false, true, false, 'active'),
    ('College Cultural Fest', 'Annual cultural extravaganza featuring dance, music, drama, and art competitions.', 'college-fest', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', CURRENT_DATE + INTERVAL '21 days', '9:00 AM', '9:00 PM', 'BITS Pilani', 'Pilani', 'Vidya Vihar, Pilani, Rajasthan', 199, 800, 445, organizer_uuid, organizer_name_param, true, false, false, 'active'),
    ('EDM Night', 'Electronic dance music night featuring top DJs and immersive light shows.', 'music', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800', CURRENT_DATE + INTERVAL '4 days', '9:00 PM', '3:00 AM', 'Kitty Su', 'Mumbai', 'Andheri West, Mumbai', 1499, 300, 267, organizer_uuid, organizer_name_param, true, true, true, 'active'),
    ('Comedy Open Mic', 'Platform for aspiring comedians to showcase their talent. Free entry for performers!', 'comedy', 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800', CURRENT_DATE + INTERVAL '1 day', '7:00 PM', '9:30 PM', 'The Habitat', 'Mumbai', 'Khar West, Mumbai', 99, 80, 62, organizer_uuid, organizer_name_param, false, false, true, 'active'),
    ('Street Food Walk', 'Guided tour of the best street food spots in Old Delhi with tastings included.', 'food', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', CURRENT_DATE + INTERVAL '6 days', '5:00 PM', '9:00 PM', 'Chandni Chowk', 'Delhi', 'Old Delhi, New Delhi', 349, 20, 18, organizer_uuid, organizer_name_param, false, false, false, 'active'),
    ('Hackathon 2026', '24-hour coding marathon with prizes worth ₹5 lakhs. Open to all college students.', 'college-fest', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800', CURRENT_DATE + INTERVAL '30 days', '10:00 AM', '10:00 AM', 'IIIT Hyderabad', 'Hyderabad', 'Gachibowli, Hyderabad', 0, 200, 178, organizer_uuid, organizer_name_param, true, true, false, 'active'),
    ('Photography Masterclass', 'Learn professional photography techniques from award-winning photographers.', 'workshop', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800', CURRENT_DATE + INTERVAL '8 days', '10:00 AM', '4:00 PM', 'Focus Academy', 'Chennai', 'T Nagar, Chennai', 799, 25, 19, organizer_uuid, organizer_name_param, false, false, false, 'active');
  END IF;
END;
$$;
