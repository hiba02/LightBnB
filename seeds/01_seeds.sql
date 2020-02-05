--INSERT INTO users (name, birth_year) VALUES ('Lora Jane', 1980);

INSERT INTO users (name, email, password)VALUES('Mike', 'aaa@amail.com', ' $2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u')
,('Bob', 'bbb@amail.com', ' $2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u')
,('Alex', 'ccc@amail.com', ' $2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u')
,('Shannon', 'ddd@qmail.com', ' $2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14'),
(4, 4, '2021-10-01', '2021-10-14');



INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) 
VALUES (1, 'Speed lamp', 'description', 'http://images.pexels.com/photo/13151', 'http://images.pexels.com/images1.jpg', 85234, 6, 6, 7, 'Canada', '651 Nami Road', 'Bohbatev', 'Alberta', 83680, true),
(2, 'Blank corner', 'description', 'http://images.pexels.com/photo/15105', 'http://images.pexels.com/images2.jpg', 46058, 0, 5, 4, 'Canada', '1650 Hejto Center', 'Genwezuj', 'Nova Scotia', 29045, true),
(3, 'Habit mix', 'description', 'http://images.pexels.com/photo/44143', 'http://images.pexels.com/images12.jpg', 82640, 0, 8, 1, 'Canada', '513 Powov Grove', 'Jaebvap', 'Ontario', 38051, true),
(4, 'Game fill', 'description', 'http://images.pexels.com/photo/22143', 'http://images.pexels.com/images15.jpg', 55555, 1, 3, 3, 'Canada', '111 Any Rd', 'Monton', 'New Brunswick', 22222, true);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1,1,5,5,'messages'),
(2,2,6,4,'messages'),
(3,3,7,5,'messages'),
(4,4,8,4,'messages');